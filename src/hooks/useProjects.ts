import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabaseClient";
import { PaginatedProjects, Project } from "@/types/project";

const PROJECTS_TABLE = "projects";

export interface UseProjectsParams {
  page?: number;
  pageSize?: number;
}

export const projectsKeys = {
  all: ["projects"] as const,
  lists: () => [...projectsKeys.all, "list"] as const,
  list: (page: number, pageSize: number) =>
    [...projectsKeys.lists(), { page, pageSize }] as const,
  details: () => [...projectsKeys.all, "detail"] as const,
  detail: (id: string) => [...projectsKeys.details(), id] as const,
};

async function fetchProjects({
  page = 1,
  pageSize = 6,
}: UseProjectsParams): Promise<PaginatedProjects> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = getSupabase();
  const { data, error, count } = await supabase
    .from(PROJECTS_TABLE)
    .select("id,name,description,images,githubRepo,deploymentLink,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    data: (data as unknown as Project[]) ?? [],
    page,
    pageSize,
    total: count ?? 0,
  };
}

async function fetchProject(id: string): Promise<Project | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(PROJECTS_TABLE)
    .select("id,name,description,images,githubRepo,deploymentLink,created_at")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return (data as unknown as Project) ?? null;
}

export function useProjects(params: UseProjectsParams) {
  const { page = 1, pageSize = 6 } = params;
  return useQuery<PaginatedProjects, Error>({
    queryKey: projectsKeys.list(page, pageSize),
    queryFn: () => fetchProjects({ page, pageSize }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    enabled: typeof window !== "undefined",
  });
}

export function useProject(id?: string) {
  return useQuery<Project | null, Error>({
    queryKey: id ? projectsKeys.detail(id) : projectsKeys.details(),
    queryFn: () => (id ? fetchProject(id) : Promise.resolve(null)),
    enabled: typeof window !== "undefined" && Boolean(id),
    staleTime: 1000 * 60,
  });
}

export function usePrefetchProjects() {
  const queryClient = useQueryClient();
  return async (page = 1, pageSize = 6) => {
    await queryClient.prefetchQuery({
      queryKey: projectsKeys.list(page, pageSize),
      queryFn: () => fetchProjects({ page, pageSize }),
      staleTime: 1000 * 30,
    });
  };
}

export function usePrefetchProject() {
  const queryClient = useQueryClient();
  return async (id: string) => {
    await queryClient.prefetchQuery({
      queryKey: projectsKeys.detail(id),
      queryFn: () => fetchProject(id),
      staleTime: 1000 * 60,
    });
  };
}


