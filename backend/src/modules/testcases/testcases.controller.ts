import type { RequestHandler } from "express";

import {
  createTestCaseSchema,
  getProblemTestCasesSchema,
  testCaseIdSchema,
  updateTestCaseSchema
} from "./testcases.validation.js";
import { testCasesService } from "./testcases.service.js";

export const getProblemTestCases: RequestHandler = async (req, res, next) => {
  try {
    const { params } = getProblemTestCasesSchema.parse({ params: req.params });
    const testCases = await testCasesService.getProblemTestCases(params.problemId);

    res.status(200).json({ testCases });
  } catch (error) {
    next(error);
  }
};

export const createTestCase: RequestHandler = async (req, res, next) => {
  try {
    const { body } = createTestCaseSchema.parse({ body: req.body });
    const testCase = await testCasesService.createTestCase(body);

    res.status(201).json({ testCase });
  } catch (error) {
    next(error);
  }
};

export const updateTestCase: RequestHandler = async (req, res, next) => {
  try {
    const { params, body } = updateTestCaseSchema.parse({
      params: req.params,
      body: req.body
    });
    const testCase = await testCasesService.updateTestCase(params.id, body);

    res.status(200).json({ testCase });
  } catch (error) {
    next(error);
  }
};

export const deleteTestCase: RequestHandler = async (req, res, next) => {
  try {
    const { params } = testCaseIdSchema.parse({ params: req.params });
    await testCasesService.deleteTestCase(params.id);

    res.status(200).json({ message: "Test case deleted successfully" });
  } catch (error) {
    next(error);
  }
};
