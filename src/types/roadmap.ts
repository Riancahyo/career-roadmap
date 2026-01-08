export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  category: 'fundamentals' | 'core' | 'advanced' | 'specialization';
  estimatedWeeks: number;
  resources: Resource[];
  prerequisites?: string[]; 
  position: { x: number; y: number }; 
}

export interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'documentation' | 'practice';
  isFree: boolean;
}

export interface Roadmap {
  id: string;
  title: string;
  careerPath: string;
  description: string; 
  color: string; 
  totalWeeks: number;
  nodes: RoadmapNode[];
  connections: Connection[];
}

export interface Connection {
  from: string; 
  to: string; 
  type: 'required' | 'optional';
}

export interface UserProgress {
  careerPath: string;
  completedNodes: string[]; 
  lastUpdated: Date;
}

export interface PersonalizedRoadmap extends Roadmap {
  aiRecommendations: string[];
  focusAreas: string[];
  skipableNodes: string[];
}