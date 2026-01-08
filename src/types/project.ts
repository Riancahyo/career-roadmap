export type ProjectDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ProjectStatus = 'not-started' | 'in-progress' | 'completed';

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: ProjectDifficulty;
  tags: string[]; 
  estimatedHours: number;
  skillsLearned: string[];
  requirements: string[];
  starterFiles?: string; 
  solutionUrl?: string; 
  participants?: number; 
}

export interface ProjectCategory {
  careerPath: string;
  projects: Project[];
}

export interface UserProjectProgress {
  projectId: string;
  careerPath: string;
  status: ProjectStatus;
  startedAt: Date;
  completedAt?: Date;
  checklist: string[]; 
}

export interface UserProjectsData {
  projects: UserProjectProgress[];
  lastUpdated: Date;
}