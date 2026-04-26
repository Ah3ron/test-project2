import { type Request, type Response, type NextFunction } from "express";

interface ValidationError {
  field: string;
  message: string;
}

export function validateProject(req: Request, res: Response, next: NextFunction) {
  const errors: ValidationError[] = [];
  const { name, description, status } = req.body;

  if (req.method === "POST" || req.method === "PUT") {
    if (req.method === "POST" && (!name || typeof name !== "string" || name.trim().length === 0)) {
      errors.push({ field: "name", message: "Name is required" });
    }
    if (name !== undefined && typeof name !== "string") {
      errors.push({ field: "name", message: "Name must be a string" });
    }
    if (name !== undefined && name.length > 255) {
      errors.push({ field: "name", message: "Name must be under 255 characters" });
    }
    if (description !== undefined && typeof description !== "string") {
      errors.push({ field: "description", message: "Description must be a string" });
    }
    if (status !== undefined) {
      const validStatuses = ["planned", "active", "completed"];
      if (!validStatuses.includes(status)) {
        errors.push({ field: "status", message: "Status must be one of: planned, active, completed" });
      }
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

export function validateComment(req: Request, res: Response, next: NextFunction) {
  const { content } = req.body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  if (content.length > 5000) {
    res.status(400).json({ error: "Content must be under 5000 characters" });
    return;
  }

  next();
}

export function validateRegistration(req: Request, res: Response, next: NextFunction) {
  const { email, password, name } = req.body;
  const errors: ValidationError[] = [];

  if (!email || typeof email !== "string") {
    errors.push({ field: "email", message: "Valid email is required" });
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    errors.push({ field: "password", message: "Password must be at least 8 characters" });
  }
  if (name !== undefined && typeof name !== "string") {
    errors.push({ field: "name", message: "Name must be a string" });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
