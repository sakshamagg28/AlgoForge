import { SubmissionStatus } from "@prisma/client";

import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/apiError.js";
import { companies, companyNameFromSlug } from "./companies.data.js";

async function getSolvedProblemIds(userId: string) {
  const accepted = await prisma.submission.findMany({
    where: {
      userId,
      status: SubmissionStatus.ACCEPTED
    },
    distinct: ["problemId"],
    select: { problemId: true }
  });

  return new Set(accepted.map((submission) => submission.problemId));
}

export const companiesService = {
  async getCompanies(userId: string) {
    const solvedProblemIds = await getSolvedProblemIds(userId);
    const problems = await prisma.problem.findMany({
      where: {
        companyTags: { hasSome: companies.map((company) => company.name) }
      },
      select: { id: true, companyTags: true }
    });

    return companies.map((company) => {
      const companyProblems = problems.filter((problem) => problem.companyTags.includes(company.name));
      const solvedCount = companyProblems.filter((problem) => solvedProblemIds.has(problem.id)).length;

      return {
        ...company,
        totalProblems: companyProblems.length,
        solvedCount,
        completionPercent: companyProblems.length === 0 ? 0 : Math.round((solvedCount / companyProblems.length) * 100)
      };
    });
  },

  async getCompanyProblems(userId: string, slug: string) {
    const companyName = companyNameFromSlug(slug);
    if (!companyName) {
      throw new ApiError(404, "Company not found");
    }

    const solvedProblemIds = await getSolvedProblemIds(userId);
    const problems = await prisma.problem.findMany({
      where: { companyTags: { has: companyName } },
      include: {
        topic: {
          select: { id: true, name: true, slug: true, difficulty: true, orderIndex: true }
        }
      },
      orderBy: [{ difficulty: "asc" }, { title: "asc" }]
    });

    return {
      company: {
        name: companyName,
        slug,
        totalProblems: problems.length,
        solvedCount: problems.filter((problem) => solvedProblemIds.has(problem.id)).length
      },
      problems: problems.map((problem) => ({
        ...problem,
        solved: solvedProblemIds.has(problem.id)
      }))
    };
  }
};
