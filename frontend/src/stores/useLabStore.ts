import { create, SetState, GetState } from 'zustand';
import { persist } from 'zustand/middleware';

import { randomProjectName } from '../util/projectName'

import {
  Project,
  ProjectType,
} from '../types/ProjectTypes'

import {
  APP_VERSION,
  SCHEMA_VERSION,
  DEFAULT_STATE_PREFIX,
  DEFAULT_OR_OPERATOR,
  DEFAULT_PROJECT_TYPE,
  DEFAULT_ACCEPTANCE_CRITERIA,
  DEFAULT_PROJECT_COLOR
} from '/src/config'

export type LabProject = Project & {_id: string}

export const createNewLabProject = (projectType: ProjectType = DEFAULT_PROJECT_TYPE): LabProject => ({
  projectType,
  _id: crypto.randomUUID(),
  states: [],
  transitions: [],
  comments: [],
  simResult: [],
  tests: {
    single: '',
    batch: ['']
  },
  initialState: null,
  meta: {
    name: randomProjectName(),
    dateCreated: new Date().getTime(),
    dateEdited: new Date().getTime(),
    version: SCHEMA_VERSION,
    automatariumVersion: APP_VERSION
  },
  config: {
    type: projectType,
    statePrefix: DEFAULT_STATE_PREFIX,
    orOperator: DEFAULT_OR_OPERATOR,
    acceptanceCriteria: DEFAULT_ACCEPTANCE_CRITERIA,
    color: DEFAULT_PROJECT_COLOR[projectType]
  }
})

export type Lab = {
  _id: string,
  description: string,
  projects: LabProject[],
  labTasks: string[],
}

export const createNewLab = (description: string): Lab => ({
  _id: crypto.randomUUID(),
  description,
  projects: [] as LabProject[],
  labTasks: [],
})

interface LabStore {
  lab: Lab;
  setLab: (lab: Lab) => void;
  setProjects: (projects: LabProject[]) => void;
  clearProjects: () => void;
  upsertProject: (project: LabProject) => void;
  deleteProject: (pid: string) => void;
  getProject: (index: number) => LabProject | undefined;
  setLabTask: (index: number, task: string) => void;
}

const useLabStore = create<LabStore>()(persist((set: SetState<LabStore>, get: GetState<LabStore>) => ({
  lab: null as Lab,
  setLab: (lab: Lab) => set({ lab }),
  setProjects: (projects: LabProject[]) => set((state) => ({lab: { ...state.lab, projects }})),
  clearProjects: () => set((state) => ({lab: { ...state.lab, projects: [] }})),
  upsertProject: (project: LabProject) => set((state) => ({
    lab: {
      ...state.lab,
      projects: state.lab?.projects.find(p => p._id === project._id)
        ? state.lab.projects.map(p => p._id === project._id ? project : p)
        : [...state.lab.projects, project]
    }
  })),
  deleteProject: (pid: string) => set((state) => ({lab: {...state.lab,projects: state.lab?.projects.filter(p => p._id !== pid)}
  })),
  getProject: (index: number) => get().lab?.projects[index] || undefined,
  setLabTask: (index: number, task: string) => set((state) => {
    const updatedTasks = [...state.lab.labTasks];
    if (index >= 0 && index < updatedTasks.length) {
      updatedTasks[index] = task;
    }
    return { lab: { ...state.lab, labTasks: updatedTasks } };
  })
}), {
  name: 'automatarium-lab', 
}));


export default useLabStore;