import ProjectForm from "../components/ProjectForm";

export default function ProjectCreatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Новый проект</h1>
      <ProjectForm mode="create" />
    </div>
  );
}
