import { create } from 'zustand';

import { Checklist } from '@/types/maintenance';

type TmpTask = {
  taskActivity: string;
  description: string | null;
};

type Task = Checklist['task'][0];

type useTaskStore = {
  taskId: string | null;
  setTaskId: (taskId: string | null) => void;
  currentTask: Task | null;
  setCurrentTask: (task: Task) => void;
  tmpTask: TmpTask | null;
  setTmpTask: (tmpTask: TmpTask) => void;
  setTmpActivity: (taskActivity: string) => void;
  setTmpDescription: (description: string | null) => void;
};

export const useTaskStore = create<useTaskStore>(set => ({
  taskId: null,
  setTaskId: taskId => {
    set({ taskId });
  },
  currentTask: null,
  setCurrentTask: task => {
    set({ currentTask: task });
  },
  tmpTask: null,
  setTmpTask: tmpTask => {
    set({ tmpTask });
  },
  setTmpActivity: taskActivity => {
    set(state => ({
      tmpTask: {
        ...state.tmpTask,
        taskActivity,
        description: state.tmpTask?.description ?? null,
      },
    }));
  },
  setTmpDescription: description => {
    set(state => ({
      tmpTask: {
        ...state.tmpTask,
        description,
        taskActivity: state.tmpTask?.taskActivity ?? '',
      },
    }));
  },
}));
