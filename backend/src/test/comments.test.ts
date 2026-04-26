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
import { commentsRouter } from "../routes/comments.js";

function createApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/comments", commentsRouter);
  return app;
}

const sampleComment = {
  id: "c1",
  projectId: "p1",
  userId: "user-1",
  content: "Hello",
  createdAt: new Date(),
  userName: "Test User",
  userEmail: "test@test.com",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/comments/project/:projectId", () => {
  it("returns comments list", async () => {
    vi.mocked(service.getComments).mockResolvedValue([sampleComment]);
    const app = createApp();
    const res = await request(app).get("/api/comments/project/p1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toEqual(expect.objectContaining({ id: "c1" }));
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(service.getComments).mockResolvedValue(null);
    const app = createApp();
    const res = await request(app).get("/api/comments/project/missing");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Project not found");
  });

  it("returns 500 on service error", async () => {
    vi.mocked(service.getComments).mockRejectedValue(new Error("fail"));
    const app = createApp();
    const res = await request(app).get("/api/comments/project/p1");
    expect(res.status).toBe(500);
  });
});

describe("POST /api/comments/project/:projectId", () => {
  it("creates comment and returns 201", async () => {
    vi.mocked(service.addComment).mockResolvedValue(sampleComment);
    const app = createApp();
    const res = await request(app)
      .post("/api/comments/project/p1")
      .send({ content: "Hello" });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe("c1");
    expect(service.addComment).toHaveBeenCalledWith("p1", "user-1", "Hello");
  });

  it("returns 400 for empty content", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/comments/project/p1")
      .send({ content: "" });
    expect(res.status).toBe(400);
  });

  it("returns 404 when project not found", async () => {
    vi.mocked(service.addComment).mockResolvedValue(null);
    const app = createApp();
    const res = await request(app)
      .post("/api/comments/project/missing")
      .send({ content: "Hello" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/comments/:id", () => {
  it("deletes and returns 204", async () => {
    vi.mocked(service.deleteComment).mockResolvedValue(true);
    const app = createApp();
    const res = await request(app).delete("/api/comments/c1");
    expect(res.status).toBe(204);
  });

  it("returns 404 when not found or not owner", async () => {
    vi.mocked(service.deleteComment).mockResolvedValue(false);
    const app = createApp();
    const res = await request(app).delete("/api/comments/missing");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Comment not found");
  });
});
