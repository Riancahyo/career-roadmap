import { Roadmap } from '@/types/roadmap';
import { frontendRoadmap } from './frontend';
import { backendRoadmap } from './backend';
import { uiuxRoadmap } from './uiux';
import { fullstackRoadmap } from './fullstack';
import { datascienceRoadmap } from './datascience';
import { dataanalystRoadmap } from './dataanalyst';
import { devopsRoadmap } from './devops';
import { mlengRoadmap } from './mleng';
import { gamedevRoadmap } from './gamedev';
import { mobileRoadmap } from './mobile';

export const roadmaps: Record<string, Roadmap> = {
  'frontend-developer': frontendRoadmap,
  'backend-developer': backendRoadmap,
  'uiux-designer': uiuxRoadmap,
  'fullstack-developer': fullstackRoadmap,
  'data-scientist': datascienceRoadmap,
  'data-analyst': dataanalystRoadmap,
  'devops-engineer': devopsRoadmap,
  'machine-learning-engineer': mlengRoadmap,
  'game-developer': gamedevRoadmap,
  'mobile-developer': mobileRoadmap,
};

export const getRoadmapById = (id: string): Roadmap | undefined => {
  return roadmaps[id];
};

export const getAllRoadmaps = (): Roadmap[] => {
  return Object.values(roadmaps);
};