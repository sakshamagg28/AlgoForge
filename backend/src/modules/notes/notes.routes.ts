import { Router } from "express";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createNote, deleteNote, getNotes, updateNote } from "./notes.controller.js";
import { createNoteSchema, noteIdSchema, updateNoteSchema } from "./notes.validation.js";

export const notesRoutes = Router();

notesRoutes.use(requireAuth);

notesRoutes.get("/", getNotes);
notesRoutes.post("/", validate(createNoteSchema), createNote);
notesRoutes.patch("/:id", validate(updateNoteSchema), updateNote);
notesRoutes.delete("/:id", validate(noteIdSchema), deleteNote);
