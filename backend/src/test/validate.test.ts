import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { validateProject, validateComment } from "../middleware/validate.js";

function mockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

function mockNext() {
  return vi.fn() as NextFunction;
}

describe("validateProject", () => {
  it("passes valid POST body", () => {
    const req = { method: "POST", body: { name: "My Project" } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateProject(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("rejects POST without name", () => {
    const req = { method: "POST", body: {} } as Request;
    const res = mockRes();
    const next = mockNext();
    validateProject(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects empty name on POST", () => {
    const req = { method: "POST", body: { name: "   " } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateProject(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("rejects name over 255 chars", () => {
    const req = { method: "POST", body: { name: "a".repeat(256) } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateProject(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    const errors = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0].errors;
    expect(errors.some((e: { field: string }) => e.field === "name")).toBe(true);
  });

  it("rejects invalid status", () => {
    const req = { method: "POST", body: { name: "Test", status: "invalid" } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateProject(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("accepts valid status values", () => {
    for (const status of ["planned", "active", "completed"]) {
      const req = { method: "POST", body: { name: "Test", status } } as Request;
      const res = mockRes();
      const next = mockNext();
      validateProject(req, res, next);
      expect(next).toHaveBeenCalled();
    }
  });

  it("rejects non-string name", () => {
    const req = { method: "POST", body: { name: 123 } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateProject(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("rejects non-string description", () => {
    const req = { method: "POST", body: { name: "Test", description: 42 } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateProject(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("passes PUT with partial data", () => {
    const req = { method: "PUT", body: { name: "Updated" } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateProject(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("passes PUT with no name (optional on PUT)", () => {
    const req = { method: "PUT", body: { status: "active" } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateProject(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe("validateComment", () => {
  it("passes valid content", () => {
    const req = { body: { content: "Hello world" } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateComment(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("rejects missing content", () => {
    const req = { body: {} } as Request;
    const res = mockRes();
    const next = mockNext();
    validateComment(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects empty content", () => {
    const req = { body: { content: "   " } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateComment(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("rejects content over 5000 chars", () => {
    const req = { body: { content: "a".repeat(5001) } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateComment(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("accepts content at exactly 5000 chars", () => {
    const req = { body: { content: "a".repeat(5000) } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateComment(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("rejects non-string content", () => {
    const req = { body: { content: 123 } } as Request;
    const res = mockRes();
    const next = mockNext();
    validateComment(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
