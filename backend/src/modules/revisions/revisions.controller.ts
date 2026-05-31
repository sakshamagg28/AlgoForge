import { RevisionStatus } from "@prisma/client";
import type { RequestHandler } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { revisionsService } from "./revisions.service.js";
import { createRevisionSchema, revisionIdSchema, updateRevisionSchema } from "./revisions.validation.js";

export const getRevisions: RequestHandler = async (req, res, next) => {
  try {
    const status =
      req.query.status === RevisionStatus.PENDING || req.query.status === RevisionStatus.COMPLETED
        ? req.query.status
        : undefined;
    const revisions = await revisionsService.getRevisions((req as AuthenticatedRequest).user.id, {
      status,
      dueOnly: req.query.due === "true"
    });

    res.status(200).json({ revisions });
  } catch (error) {
    next(error);
  }
};

export const createRevision: RequestHandler = async (req, res, next) => {
  try {
    const { body } = createRevisionSchema.parse({ body: req.body });
    const revision = await revisionsService.createRevision((req as AuthenticatedRequest).user.id, body);

    res.status(201).json({ revision });
  } catch (error) {
    next(error);
  }
};

export const updateRevision: RequestHandler = async (req, res, next) => {
  try {
    const { params, body } = updateRevisionSchema.parse({ params: req.params, body: req.body });
    const revision = await revisionsService.updateRevision((req as AuthenticatedRequest).user.id, params.id, body);

    res.status(200).json({ revision });
  } catch (error) {
    next(error);
  }
};

export const completeRevision: RequestHandler = async (req, res, next) => {
  try {
    const { params } = revisionIdSchema.parse({ params: req.params });
    const revision = await revisionsService.completeRevision((req as AuthenticatedRequest).user.id, params.id);

    res.status(200).json({ revision });
  } catch (error) {
    next(error);
  }
};

export const deleteRevision: RequestHandler = async (req, res, next) => {
  try {
    const { params } = revisionIdSchema.parse({ params: req.params });
    await revisionsService.deleteRevision((req as AuthenticatedRequest).user.id, params.id);

    res.status(200).json({ message: "Revision deleted successfully" });
  } catch (error) {
    next(error);
  }
};
