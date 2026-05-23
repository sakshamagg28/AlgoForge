import type { RequestHandler } from "express";

import { problemsService } from "./problems.service.js";
import {
  createProblemSchema,
  getProblemBySlugSchema,
  problemIdSchema,
  updateProblemSchema
} from "./problems.validation.js";

export const getProblems: RequestHandler = async (_req, res, next) => {
  try {
    const problems = await problemsService.getProblems();
    res.status(200).json({ problems });
  } catch (error) {
    next(error);
  }
};

export const getProblemBySlug: RequestHandler = async (req, res, next) => {
  try {
    const { params } = getProblemBySlugSchema.parse({ params: req.params });
    const problem = await problemsService.getProblemBySlug(params.slug);

    res.status(200).json({ problem });
  } catch (error) {
    next(error);
  }
};

export const createProblem: RequestHandler = async (req, res, next) => {
  try {
    const { body } = createProblemSchema.parse({ body: req.body });
    const problem = await problemsService.createProblem(body);

    res.status(201).json({ problem });
  } catch (error) {
    next(error);
  }
};

export const updateProblem: RequestHandler = async (req, res, next) => {
  try {
    const { params, body } = updateProblemSchema.parse({
      params: req.params,
      body: req.body
    });
    const problem = await problemsService.updateProblem(params.id, body);

    res.status(200).json({ problem });
  } catch (error) {
    next(error);
  }
};

export const deleteProblem: RequestHandler = async (req, res, next) => {
  try {
    const { params } = problemIdSchema.parse({ params: req.params });
    await problemsService.deleteProblem(params.id);

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    next(error);
  }
};
