export interface ProjectImage {
  url: string;
  alt?: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  images: ProjectImage[];
  githubRepo: string;
  deploymentLink?: string | null;
  created_at?: string;
}

export interface PaginatedProjects {
  data: Project[];
  page: number;
  pageSize: number;
  total: number;
}


