import {v1} from "uuid";
import {TasksStateType} from "../App";
import {AddTLActionType, RemoveTLActionType} from "./todolists-reducer";


export type removeTaskActionType = {
    type: 'REMOVE-TASK'
    taskId: string
    todoListId: string
}
export type addTaskActionType = {
    type: 'ADD-TASK'
    taskTitle: string
    todoListId: string
}
export type changeTaskStatusType = {
    type: 'CHANGE-TASK-STATUS'
    taskId: string
    isDone: boolean
    todolistId: string
}
export type changeTaskTitleType = {
    type: 'CHANGE-TASK-TITLE'
    taskId: string
    taskTitle: string,
    todolistId: string
}

type ActionsType = removeTaskActionType | addTaskActionType | changeTaskStatusType | changeTaskTitleType | AddTLActionType | RemoveTLActionType;


export const removeTaskAC = (taskId: string, todoListId: string): removeTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todoListId: todoListId}
}

export const addTaskAC = (title: string, todoListId: string): addTaskActionType => {
    return {type: 'ADD-TASK', taskTitle: title, todoListId: todoListId}
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string): changeTaskStatusType => {
    return {type: 'CHANGE-TASK-STATUS', taskId: taskId, isDone: isDone, todolistId: todolistId}
}

export const changeTaskTitleAC = (taskId: string, taskTitle: string, todolistId: string):changeTaskTitleType => {
    return {type: 'CHANGE-TASK-TITLE', taskId: taskId, taskTitle: taskTitle, todolistId: todolistId}
}

export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todoListId];
            const filteredTasks = tasks.filter(el => el.id !== action.taskId);
            stateCopy[action.todoListId] = filteredTasks;
            return stateCopy
        }
        case "ADD-TASK": {
            const stateCopy = {...state};
            let task = {id: v1(), title: action.taskTitle, isDone: false};
            let todolistTasks = stateCopy[action.todoListId];
            stateCopy[action.todoListId] = [task, ...todolistTasks];
            return stateCopy;
        }
        case "CHANGE-TASK-STATUS": {
            const stateCopy = {...state};
            let todolistTasks = stateCopy[action.todolistId];
            let task = todolistTasks.find(el => el.id === action.taskId);
            if (task) {
                task.isDone = action.isDone;
            }
            return stateCopy
        }
            case "CHANGE-TASK-TITLE":{
                const stateCopy = {...state};
                let todolistTasks = stateCopy[action.todolistId];
                let task = todolistTasks.find(el => el.id === action.taskId);
                if (task) {
                    task.title = action.taskTitle;
                }
                return stateCopy
            }
        case "ADD-TODOLIST":{
            const stateCopy = {...state};

            stateCopy[action.todolistId] = [];

            return stateCopy
        }
        case "REMOVE-TODOLIST":{
            const stateCopy = {...state};
            delete stateCopy[action.id]
            return stateCopy;
        }
        default:
            return state;
    }
}