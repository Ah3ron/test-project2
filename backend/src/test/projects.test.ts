import { describe, it, expect, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";
import type { AuthenticatedRequest } from "../middleware/auth.js";

vi.mock("../services/projectService.js", () => ({
  getProjects: vi.fn(),
  getProjectById: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
  getChangeLog: vi.fn(),
  getComments: vi.fn(),
  addComment: vi.fn(),
  deleteComment: vi.fn(),
}));

vi.mock("../middleware/auth.js", () => ({
  requireAuth: (req: AuthenticatedRequest, _res: express.Response, next: express.NextFunction) => {
    req.userId = "user-1";
    next();
  },
}));

vi.mock("../middleware/validate.js", async () => {
  const actual = await vi.importActual<typeof import("../middleware/validate.js")>("../middleware/validate.js");
  return actual;
});

import * as service from "../services/projectService.js";
import { projectsRouter } from "../routes/projects.js";

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/projects", projectsRouter);
  return app;
}

const sampleProject = {
  id: "p1",
  userId: "user-1",
  name: "Test Project",
  description: "desc",
  status: "planned",
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/projects", () => {
  it("returns project list", async () => {
    vi.mocked(service.getProjects).mockResolvedValue([sampleProject]);
    const app = createApp();
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([expect.objectContaining({ id: "p1" })]);
  });

  it("returns 500 on service error", async () => {
    vi.mocked(service.getProjects).mockRejectedValue(new Error("DB down"));
    const app = createApp();
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to fetch projects");
  });
});

describe("GET /api/projects/:id", () => {
  it("returns project by id", async () => {
    vi.mocked(service.getProjectById).mockResolvedValue(sampleProject);
    const app = createApp();
    const res = await request(app).get("/api/projects/p1");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("p1");
  });

  it("returns 404 when not found", async () => {
    vi.mocked(service.getProjectById).mockResolvedValue(undefined);
    const app = createApp();
    const res = await request(app).get("/api/projects/missing");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Project not found");
  });
});

describe("POST /api/projects", () => {
  it("creates project and returns 201", async () => {
    vi.mocked(service.createProject).mockResolvedValue(sampleProject);
    const app = createApp();
    const res = await request(app)
      .post("/api/projects")
      .send({ name: "Test Project" });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe("p1");
    expect(service.createProject).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Test Project", userId: "user-1" })
    );
  });

  it("returns 400 for missing name", async () => {
    const app = createApp();
    const res = await request(app).post("/api/projects").send({});
    expect(res.status).toBe(400);
  });

  it("returns 500 on service error", async () => {
    vi.mocked(service.createProject).mockRejectedValue(new Error("fail"));
    const app = createApp();
    const res = await request(app)
      .post("/api/projects")
      .send({ name: "Test" });
    expect(res.status).toBe(500);
  });
});

describe("PUT /api/projects/:id", () => {
  it("updates project and returns result", async () => {
    const updated = { ...sampleProject, name: "Updated" };
    vi.mocked(service.updateProject).mockResolvedValue({ error: null, project: updated });
    const app = createApp();
    const res = await request(app)
      .put("/api/projects/p1")
      .send({ name: "Updated" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated");
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(service.updateProject).mockResolvedValue(null);
    const app = createApp();
    const res = await request(app)
      .put("/api/projects/p1")
      .send({ name: "X" });
    expect(res.status).toBe(404);
  });

  it("returns 403 for completed project", async () => {
    vi.mocked(service.updateProject).mockResolvedValue({ error: "completed", project: null });
    const app = createApp();
    const res = await request(app)
      .put("/api/projects/p1")
      .send({ name: "X" });
    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Cannot edit a completed project");
  });
});

describe("DELETE /api/projects/:id", () => {
  it("deletes and returns 204", async () => {
    vi.mocked(service.deleteProject).mockResolvedValue(true);
    const app = createApp();
    const res = await request(app).delete("/api/projects/p1");
    expect(res.status).toBe(204);
  });

  it("returns 404 when not found", async () => {
    vi.mocked(service.deleteProject).mockResolvedValue(false);
    const app = createApp();
    const res = await request(app).delete("/api/projects/missing");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/projects/:id/changelog", () => {
  it("returns changelog", async () => {
    const log = [{ id: "cl1", fieldName: "status", oldValue: "planned", newValue: "active" }];
    vi.mocked(service.getChangeLog).mockResolvedValue(log);
    const app = createApp();
    const res = await request(app).get("/api/projects/p1/changelog");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(service.getChangeLog).mockResolvedValue(null);
    const app = createApp();
    const res = await request(app).get("/api/projects/missing/changelog");
    expect(res.status).toBe(404);
  });
});
