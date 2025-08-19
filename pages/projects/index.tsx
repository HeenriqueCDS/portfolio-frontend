import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { DefaultLayout } from "@/shared/default-layout";
import { usePrefetchProject, usePrefetchProjects, useProjects } from "@/hooks/useProjects";
import type { PaginatedProjects } from "@/types/project";

const PAGE_SIZE = 6;

const ProjectsPage: NextPage = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const page = useMemo(() => {
    const q = Array.isArray(router.query.page)
      ? router.query.page[0]
      : router.query.page;
    const n = Number(q || 1);
    return Number.isNaN(n) || n < 1 ? 1 : n;
  }, [router.query.page]);

  const { data, isLoading, isError } = useProjects({ page, pageSize: PAGE_SIZE });
  const list = data as PaginatedProjects | undefined;
  const prefetchProjects = usePrefetchProjects();
  const prefetchProject = usePrefetchProject();

  const totalPages = useMemo(() => {
    if (!list) return 1;
    const total = list.total;
    const pageSize = list.pageSize;
    return Math.max(1, Math.ceil(total / pageSize));
  }, [list]);

  if (!mounted) {
    return (
      <DefaultLayout>
        <div className="mx-auto max-w-6xl px-4 py-8 text-blue-50">
          <h1 className="text-3xl font-bold mb-6">Projects</h1>
        </div>
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="h-12 w-12 rounded-full border-4 border-green-400 border-t-transparent animate-spin" />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 text-blue-50">
        <h1 className="text-3xl font-bold mb-6">Projects</h1>
        <div className="flex flex-col min-h-[60vh] gap-8">
          {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="h-12 w-12 rounded-full border-4 border-green-400 border-t-transparent animate-spin" />
            </div>
          )}
          {isError && (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-400">Failed to load projects. Please try again.</p>
            </div>
          )}
          {!isLoading && !isError && list && (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(list.data || []).map((project) => (
                  <li key={project.id} className="bg-neutral-800 rounded-lg p-4 shadow hover:shadow-lg transition-shadow">
                    <Link
                      href={`/projects/${project.id}`}
                      className="block"
                      onMouseEnter={() => {
                        prefetchProject(project.id);
                      }}
                    >
                      <div className="w-full h-40 relative mb-3 overflow-hidden rounded-md bg-neutral-700">
                        {project.images && project.images.length > 0 ? (
                          <Image
                            src={project.images[0].url}
                            alt={project.images[0].alt || project.name}
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            No image
                          </div>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                      <p className="text-neutral-300">
                        {project.description.length > 160
                          ? `${project.description.slice(0, 160)}...`
                          : project.description}
                      </p>
                    </Link>
                    <div className="mt-3 flex gap-3">
                      <a
                        href={project.githubRepo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-400 hover:text-green-300 text-sm"
                      >
                        GitHub
                      </a>
                      {project.deploymentLink ? (
                        <a
                          href={project.deploymentLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-400 hover:text-green-300 text-sm"
                        >
                          Live
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-center gap-2 mt-auto">
                <button
                  disabled={page <= 1}
                  onMouseEnter={() => prefetchProjects(Math.max(1, page - 1), PAGE_SIZE)}
                  onClick={() => router.push(`/projects?page=${Math.max(1, page - 1)}`)}
                  className="px-3 py-2 rounded bg-neutral-700 disabled:opacity-50 hover:bg-neutral-600"
                >
                  Previous
                </button>
                <span className="text-neutral-300 text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onMouseEnter={() => prefetchProjects(Math.min(totalPages, page + 1), PAGE_SIZE)}
                  onClick={() => router.push(`/projects?page=${Math.min(totalPages, page + 1)}`)}
                  className="px-3 py-2 rounded bg-neutral-700 disabled:opacity-50 hover:bg-neutral-600"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProjectsPage;


