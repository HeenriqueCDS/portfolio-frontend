import { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";

import { DefaultLayout } from "@/shared/default-layout";
import { useProject } from "@/hooks/useProjects";

const ProjectDetailPage: NextPage = () => {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : undefined;

  const { data: project, isLoading, isError } = useProject(id);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 text-blue-50">
        {isLoading && (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="h-12 w-12 rounded-full border-4 border-green-400 border-t-transparent animate-spin" />
          </div>
        )}
        {isError && <p className="text-red-400">Failed to load project.</p>}
        {!isLoading && !isError && project && (
          <>
            <button
              onClick={() => router.back()}
              className="mb-4 text-green-400 hover:text-green-300"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
            {project.images && project.images.length > 0 ? (
              <div className="w-full h-80 relative mb-6 overflow-hidden rounded-md bg-neutral-700">
                <Image
                  src={project.images[0].url}
                  alt={project.images[0].alt || project.name}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              </div>
            ) : null}
            <p className="text-neutral-200 whitespace-pre-line">{project.description}</p>
            <div className="mt-6 flex gap-4">
              <a
                href={project.githubRepo}
                target="_blank"
                rel="noreferrer"
                className="text-green-400 hover:text-green-300"
              >
                GitHub Repo
              </a>
              {project.deploymentLink ? (
                <a
                  href={project.deploymentLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-400 hover:text-green-300"
                >
                  Live Demo
                </a>
              ) : null}
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ProjectDetailPage;


