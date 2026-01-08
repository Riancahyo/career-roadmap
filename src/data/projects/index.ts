import { Project } from '@/types/project';
import { frontendProjects } from './frontend';
import { backendProjects } from './backend';
import { uiuxProjects } from './uiux';
import { datascienceProjects } from './datascience';
import { mobileProjects } from './mobile';
import { devopsProjects } from './devops';
import { gamedevProjects } from './gamedev';

export const projectsByCareerPath: Record<string, Project[]> = {
  'frontend-developer': frontendProjects,
  'backend-developer': backendProjects,
  'uiux-designer': uiuxProjects,
  'fullstack-developer': [...frontendProjects, ...backendProjects], 
  'data-scientist': datascienceProjects,
  'data-analyst': datascienceProjects, 
  'devops-engineer': devopsProjects,
  'machine-learning-engineer': datascienceProjects, 
  'game-developer': gamedevProjects,
  'mobile-developer': mobileProjects,
};

export const getProjectsByCareerPath = (careerPathId: string): Project[] => {
  return projectsByCareerPath[careerPathId] || [];
};

export const hasProjects = (careerPathId: string): boolean => {
  return (projectsByCareerPath[careerPathId]?.length || 0) > 0;
};