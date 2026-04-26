import { db } from "../db/index.js";
import { projects, projectChangeLogs, projectComments, users } from "../db/schema.js";
import { eq, and, desc } from "drizzle-orm";

export async function getProjects(userId: string) {
  return db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.updatedAt));
}

export async function getProjectById(id: string, userId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)));
  return project;
}

export async function createProject(data: {
  name: string;
  description?: string;
  status?: string;
  userId: string;
}) {
  const [project] = await db
    .insert(projects)
    .values({
      name: data.name,
      description: data.description || null,
      status: data.status || "planned",
      userId: data.userId,
    })
    .returning();
  return project;
}

export async function updateProject(
  id: string,
  userId: string,
  data: { name?: string; description?: string; status?: string }
) {
  const existing = await getProjectById(id, userId);
  if (!existing) return null;

  if (existing.status === "completed") {
    return { error: "completed", project: null };
  }

  const trackedFields = ["name", "description", "status"] as const;
  const changes: { fieldName: string; oldValue: string | null; newValue: string | null }[] = [];

  for (const field of trackedFields) {
    if (data[field] !== undefined && data[field] !== existing[field]) {
      changes.push({
        fieldName: field,
        oldValue: String(existing[field] ?? ""),
        newValue: String(data[field] ?? ""),
      });
    }
  }

  if (changes.length === 0) {
    return { error: null, project: existing };
  }

  const result = await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();

    if (changes.length > 0) {
      await tx.insert(projectChangeLogs).values(
        changes.map((c) => ({
          projectId: id,
          fieldName: c.fieldName,
          oldValue: c.oldValue,
          newValue: c.newValue,
        }))
      );
    }

    return updated;
  });

  return { error: null, project: result };
}

export async function deleteProject(id: string, userId: string) {
  const existing = await getProjectById(id, userId);
  if (!existing) return false;

  await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
  return true;
}

export async function getChangeLog(projectId: string, userId: string) {
  const project = await getProjectById(projectId, userId);
  if (!project) return null;

  return db
    .select()
    .from(projectChangeLogs)
    .where(eq(projectChangeLogs.projectId, projectId))
    .orderBy(desc(projectChangeLogs.changedAt));
}

export async function getComments(projectId: string, userId: string) {
  const project = await getProjectById(projectId, userId);
  if (!project) return null;

  return db
    .select({
      id: projectComments.id,
      projectId: projectComments.projectId,
      userId: projectComments.userId,
      content: projectComments.content,
      createdAt: projectComments.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(projectComments)
    .where(eq(projectComments.projectId, projectId))
    .leftJoin(users, eq(projectComments.userId, users.id))
    .orderBy(desc(projectComments.createdAt));
}

export async function addComment(
  projectId: string,
  userId: string,
  content: string
) {
  const project = await getProjectById(projectId, userId);
  if (!project) return null;

  const [comment] = await db
    .insert(projectComments)
    .values({ projectId, userId, content })
    .returning();

  const [user] = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, userId));

  return {
    ...comment,
    userName: user?.name ?? null,
    userEmail: user?.email ?? null,
  };
}

export async function deleteComment(commentId: string, userId: string) {
  const [comment] = await db
    .select()
    .from(projectComments)
    .where(eq(projectComments.id, commentId));

  if (!comment || comment.userId !== userId) return false;

  await db.delete(projectComments).where(eq(projectComments.id, commentId));
  return true;
}
