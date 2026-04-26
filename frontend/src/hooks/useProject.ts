import { useState, useEffect } from "react";
import type { Project, ProjectChangeLog, ProjectComment } from "../types";
import { api } from "../api/client";

export function useProject(id: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [changelog, setChangelog] = useState<ProjectChangeLog[]>([]);
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, cl, cm] = await Promise.all([
        api.projects.get(id),
        api.projects.changelog(id),
        api.comments.list(id),
      ]);
      setProject(p);
      setChangelog(cl);
      setComments(cm);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  return { project, changelog, comments, loading, error, refetch: load };
}
