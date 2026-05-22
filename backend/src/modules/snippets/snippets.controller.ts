import type { RequestHandler } from "express";

import { notImplemented } from "../../utils/notImplemented.js";

export const getSnippets: RequestHandler = notImplemented("GET /api/snippets");
export const createSnippet: RequestHandler = notImplemented("POST /api/snippets");
export const getSnippetById: RequestHandler = notImplemented("GET /api/snippets/:id");
export const updateSnippet: RequestHandler = notImplemented("PUT /api/snippets/:id");
export const deleteSnippet: RequestHandler = notImplemented("DELETE /api/snippets/:id");
