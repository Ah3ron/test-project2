import { Router } from "express";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { validateProject } from "../middleware/validate.js";
import * as service from "../services/projectService.js";

const router = Router();

const getId = (req: AuthenticatedRequest) => req.params.id as string;

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const list = await service.getProjects(req.userId!);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.get("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const project = await service.getProjectById(getId(req), req.userId!);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(project);
  } catch {
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

router.post(
  "/",
  requireAuth,
  validateProject,
  async (req: AuthenticatedRequest, res) => {
    try {
      const project = await service.createProject({
        ...req.body,
        userId: req.userId!,
      });
      res.status(201).json(project);
    } catch {
      res.status(500).json({ error: "Failed to create project" });
    }
  }
);

router.put(
  "/:id",
  requireAuth,
  validateProject,
  async (req: AuthenticatedRequest, res) => {
    try {
      const result = await service.updateProject(getId(req), req.userId!, req.body);
      if (!result) {
        res.status(404).json({ error: "Project not found" });
        return;
      }
      if (result.error === "completed") {
        res.status(403).json({ error: "Cannot edit a completed project" });
        return;
      }
      res.json(result.project);
    } catch {
      res.status(500).json({ error: "Failed to update project" });
    }
  }
);

router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const deleted = await service.deleteProject(getId(req), req.userId!);
    if (!deleted) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

router.get("/:id/changelog", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const changelog = await service.getChangeLog(getId(req), req.userId!);
    if (!changelog) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(changelog);
  } catch {
    res.status(500).json({ error: "Failed to fetch changelog" });
  }
});

export { router as projectsRouter };
