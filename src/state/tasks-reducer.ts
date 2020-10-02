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

type ActionsType =
    removeTaskActionType
    | addTaskActionType
    | changeTaskStatusType
    | changeTaskTitleType
    | AddTLActionType
    | RemoveTLActionType;


export const removeTaskAC = (taskId: string, todoListId: string): removeTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todoListId: todoListId}
}

export const addTaskAC = (title: string, todoListId: string): addTaskActionType => {
    return {type: 'ADD-TASK', taskTitle: title, todoListId: todoListId}
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string): changeTaskStatusType => {
    return {type: 'CHANGE-TASK-STATUS', taskId: taskId, isDone: isDone, todolistId: todolistId}
}

export const changeTaskTitleAC = (taskId: string, taskTitle: string, todolistId: string): changeTaskTitleType => {
    return {type: 'CHANGE-TASK-TITLE', taskId: taskId, taskTitle: taskTitle, todolistId: todolistId}
}

const initialState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            const stateCopy = {...state};
            const tasks = stateCopy[action.todoListId];
            stateCopy[action.todoListId] = tasks.filter(el => el.id !== action.taskId);
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
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(el => el.id === action.taskId
                        ? {...el,isDone: action.isDone}
                        : el)
            }
        }
        case "CHANGE-TASK-TITLE": {
            return{
                ...state, [action.todolistId]:state[action.todolistId]
                    .map(el => el.id === action.taskId
                        ? {...el, title: action.taskTitle}
                        : el)
            }
        }
        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todolistId]: []
            }

        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state};
            delete stateCopy[action.id]
            return stateCopy;
        }
        default:
            return state;
    }
}