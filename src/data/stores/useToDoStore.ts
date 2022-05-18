import create, { State, StateCreator } from "zustand";
import { generateId } from "../helpers";
import { devtools } from "zustand/middleware";

interface Task {
    id: string;
    title: string;
    createdAt: number;
}

interface ToDoStore {
    tasks: Task[];
    createTask: (title: string) => void;
    updateTask: (id: string, title: string) => void;
    removeTask: (id: string) => void;
}

function isToDoStore(obj: any): obj is ToDoStore {
    return 'tasks' in obj;
}

const localStorageUpdate = <T extends State>(config: StateCreator<T>):
    StateCreator<T> => (set, get, api) => config((nextState, ...args
        ) => {
            if (isToDoStore(nextState)) {
                window.localStorage.setItem('tasks', JSON.stringify(nextState.tasks));
            }
            set(nextState, ...args);
        }, get, api);

const getCurrentState = (): Task[] => {
    try {
        return JSON.parse(window.localStorage.getItem('tasks') ?? '[]') as Task[];
    } catch (e) {
        window.localStorage.setItem('tasks', '[]');
        return [];
    }
};

export const useToDoStore = create<ToDoStore>(localStorageUpdate(devtools((set, get) => ({
    tasks: getCurrentState(),
    createTask: (title: string) => {
        const { tasks } = get();
        const newTask = {
            id: generateId(),
            title,
            createdAt: (new Date()).getTime()
        };
        set({
            tasks: [newTask].concat(tasks),
        });
    },
    updateTask: (id: string, title: string) => {
        const { tasks } = get();
        set({
            tasks: tasks.map(task => ({
                ...task,
                title: task.id === id ? title : task.title
            })),
        });
    },
    removeTask: (id: string) => {
        const { tasks } = get();
        set({
            tasks: tasks.filter(task => task.id !== id),
        });
    }
}))));