import { create } from 'zustand';

type TmpTask = {
  taskActivity: string;
  description: string | null;
};

type useTaskStore = {
  taskId: string | null;
  setTaskId: (taskId: string | null) => void;
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
