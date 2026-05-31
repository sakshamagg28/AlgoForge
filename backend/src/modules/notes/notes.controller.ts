import type { RequestHandler } from "express";

import type { AuthenticatedRequest } from "../../middleware/auth.middleware.js";
import { notesService } from "./notes.service.js";
import { createNoteSchema, noteIdSchema, updateNoteSchema } from "./notes.validation.js";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await notesService.getNotes((req as AuthenticatedRequest).user.id, {
      topicId: typeof req.query.topicId === "string" ? req.query.topicId : undefined,
      problemId: typeof req.query.problemId === "string" ? req.query.problemId : undefined,
      bookmarked: req.query.bookmarked === "true" ? true : undefined
    });

    res.status(200).json({ notes });
  } catch (error) {
    next(error);
  }
};

export const createNote: RequestHandler = async (req, res, next) => {
  try {
    const { body } = createNoteSchema.parse({ body: req.body });
    const note = await notesService.createNote((req as AuthenticatedRequest).user.id, body);

    res.status(201).json({ note });
  } catch (error) {
    next(error);
  }
};

export const updateNote: RequestHandler = async (req, res, next) => {
  try {
    const { params, body } = updateNoteSchema.parse({ params: req.params, body: req.body });
    const note = await notesService.updateNote((req as AuthenticatedRequest).user.id, params.id, body);

    res.status(200).json({ note });
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    const { params } = noteIdSchema.parse({ params: req.params });
    await notesService.deleteNote((req as AuthenticatedRequest).user.id, params.id);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};
