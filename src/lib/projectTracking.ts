import { UserProjectProgress, UserProjectsData, ProjectStatus } from '@/types/project';

const STORAGE_KEY = 'user-projects-progress';

export const getUserProjects = (): UserProjectProgress[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed: UserProjectsData = JSON.parse(data);
    return parsed.projects;
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

export const getProjectProgress = (projectId: string): UserProjectProgress | null => {
  const projects = getUserProjects();
  return projects.find(p => p.projectId === projectId) || null;
};

export const startProject = (projectId: string, careerPath: string): void => {
  const projects = getUserProjects();
  const existing = projects.find(p => p.projectId === projectId);
  
  if (existing) {
    return;
  }
  
  const newProject: UserProjectProgress = {
    projectId,
    careerPath,
    status: 'in-progress',
    startedAt: new Date(),
    checklist: [],
  };
  
  projects.push(newProject);
  saveProjects(projects);
};

export const updateProjectStatus = (
  projectId: string,
  status: ProjectStatus
): void => {
  const projects = getUserProjects();
  const project = projects.find(p => p.projectId === projectId);
  
  if (!project) return;
  
  project.status = status;
  if (status === 'completed') {
    project.completedAt = new Date();
  }
  
  saveProjects(projects);
};

export const toggleRequirement = (
  projectId: string,
  requirement: string
): void => {
  const projects = getUserProjects();
  const project = projects.find(p => p.projectId === projectId);
  
  if (!project) return;
  
  const index = project.checklist.indexOf(requirement);
  if (index > -1) {
    project.checklist.splice(index, 1);
  } else {
    project.checklist.push(requirement);
  }
  
  saveProjects(projects);
};

export const getProjectStats = (careerPath?: string) => {
  const projects = getUserProjects();
  const filtered = careerPath 
    ? projects.filter(p => p.careerPath === careerPath)
    : projects;
  
  return {
    total: filtered.length,
    inProgress: filtered.filter(p => p.status === 'in-progress').length,
    completed: filtered.filter(p => p.status === 'completed').length,
  };
};

const saveProjects = (projects: UserProjectProgress[]): void => {
  const data: UserProjectsData = {
    projects,
    lastUpdated: new Date(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const isProjectStarted = (projectId: string): boolean => {
  const project = getProjectProgress(projectId);
  return project !== null;
};

export const getCompletionPercentage = (
  projectId: string,
  totalRequirements: number
): number => {
  const project = getProjectProgress(projectId);
  if (!project) return 0;
  
  return Math.round((project.checklist.length / totalRequirements) * 100);
};