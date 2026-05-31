import { Router } from "express";

import { requireAdmin, requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createTestCase, deleteTestCase, getProblemTestCases, updateTestCase } from "./testcases.controller.js";
import {
  createTestCaseSchema,
  getProblemTestCasesSchema,
  testCaseIdSchema,
  updateTestCaseSchema
} from "./testcases.validation.js";

export const testCasesRoutes = Router();

testCasesRoutes.use(requireAuth);
testCasesRoutes.use(requireAdmin);

testCasesRoutes.get("/problems/:problemId", validate(getProblemTestCasesSchema), getProblemTestCases);
testCasesRoutes.post("/", validate(createTestCaseSchema), createTestCase);
testCasesRoutes.patch("/:id", validate(updateTestCaseSchema), updateTestCase);
testCasesRoutes.delete("/:id", validate(testCaseIdSchema), deleteTestCase);
