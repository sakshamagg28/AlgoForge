import { Router } from "express";

import {
  createSnippet,
  deleteSnippet,
  getSnippetById,
  getSnippets,
  updateSnippet
} from "./snippets.controller.js";

export const snippetsRoutes = Router();

snippetsRoutes.get("/", getSnippets);
snippetsRoutes.post("/", createSnippet);
snippetsRoutes.get("/:id", getSnippetById);
snippetsRoutes.put("/:id", updateSnippet);
snippetsRoutes.delete("/:id", deleteSnippet);
