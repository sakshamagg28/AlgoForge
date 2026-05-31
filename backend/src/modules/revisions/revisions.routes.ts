import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  completeRevision,
  createRevision,
  deleteRevision,
  getRevisions,
  updateRevision
} from "./revisions.controller.js";
import { createRevisionSchema, revisionIdSchema, updateRevisionSchema } from "./revisions.validation.js";

export const revisionsRoutes = Router();

revisionsRoutes.use(requireAuth);

revisionsRoutes.get("/", getRevisions);
revisionsRoutes.post("/", validate(createRevisionSchema), createRevision);
revisionsRoutes.patch("/:id", validate(updateRevisionSchema), updateRevision);
revisionsRoutes.patch("/:id/complete", validate(revisionIdSchema), completeRevision);
revisionsRoutes.delete("/:id", validate(revisionIdSchema), deleteRevision);
