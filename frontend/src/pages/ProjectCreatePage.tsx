import ProjectForm from "../components/ProjectForm";

export default function ProjectCreatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6">Новый проект</h1>
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <ProjectForm mode="create" />
          </div>
        </div>
      </div>
    </div>
  );
}
