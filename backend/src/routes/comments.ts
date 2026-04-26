import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { validateComment } from "../middleware/validate.js";
import * as service from "../services/projectService.js";

const router = Router();

const getProjectId = (req: AuthenticatedRequest) => req.params.projectId as string;
const getId = (req: AuthenticatedRequest) => req.params.id as string;

router.get(
  "/project/:projectId",
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    try {
      const comments = await service.getComments(getProjectId(req), req.userId!);
      if (!comments) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.json(comments);
    } catch {
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  }
);

router.post(
  "/project/:projectId",
  requireAuth,
  validateComment,
  async (req: AuthenticatedRequest, res) => {
    try {
      const comment = await service.addComment(
        getProjectId(req),
        req.userId!,
        req.body.content
      );
      if (!comment) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      res.status(201).json(comment);
    } catch {
      res.status(500).json({ error: "Failed to add comment" });
    }
  }
);

router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const deleted = await service.deleteComment(getId(req), req.userId!);
    if (!deleted) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export { router as commentsRouter };
