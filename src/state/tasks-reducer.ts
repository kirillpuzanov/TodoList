import {AddTLActionType, RemoveTLActionType, SetTodolistsACType} from "./todolists-reducer";
import {TaskStatuses, TaskType, todolistApi} from "../api/todolist-api";
import {TasksStateType} from "../AppWithRedux";
import {ThunkAction} from "redux-thunk";
import {AppRootStateType} from "./Store";


export type removeTaskActionType = {
    type: 'REMOVE-TASK'
    taskId: string
    todoListId: string
}
export type addTaskActionType = {
    type: 'ADD-TASK'
    task: TaskType
}
export type changeTaskStatusType = {
    type: 'CHANGE-TASK-STATUS'
    taskId: string
    status: TaskStatuses
    todolistId: string
}
export type changeTaskTitleType = {
    type: 'CHANGE-TASK-TITLE'
    taskId: string
    taskTitle: string,
    todolistId: string
}
export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todolistId: string
}


type ActionsType =
    removeTaskActionType
    | addTaskActionType
    | changeTaskStatusType
    | changeTaskTitleType
    | AddTLActionType
    | RemoveTLActionType
    | SetTodolistsACType
    | SetTasksActionType;


export const removeTaskAC = (taskId: string, todoListId: string): removeTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todoListId: todoListId}
}

export const addTaskAC = (task: TaskType): addTaskActionType => {
    return {type: 'ADD-TASK', task}
}

export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): changeTaskStatusType => {
    return {type: 'CHANGE-TASK-STATUS', taskId: taskId, status, todolistId: todolistId}
}

export const changeTaskTitleAC = (taskId: string, taskTitle: string, todolistId: string): changeTaskTitleType => {
    return {type: 'CHANGE-TASK-TITLE', taskId: taskId, taskTitle: taskTitle, todolistId: todolistId}
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks, todolistId}
}

/////// thunk's
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

export const fetchTasksTC = (todolistId: string): ThunkType => (dispatch) => {
    todolistApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string): ThunkType => (dispatch) => {
    todolistApi.deleteTask(taskId, todolistId)
        .then(() => {
            dispatch(removeTaskAC(taskId, todolistId))
        })
}
export const addTaskTC = (taskTitle: string, todolistId: string): ThunkType => (dispatch) => {
    todolistApi.createTask(taskTitle, todolistId)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item))
        })
}
export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    const tasks = getState().tasks[todolistId]
    const currentTask = tasks.find(t => t.id === taskId)
    if (currentTask) {
        todolistApi.updateTask(todolistId, taskId, {
            status: status,
            deadline: currentTask.deadline,
            description: currentTask.description,
            priority: currentTask.priority,
            startDate: currentTask.startDate,
            title: currentTask.title
        }).then( ()=> {
            dispatch( changeTaskStatusAC(taskId,status,todolistId))
        })
    }


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
            let tasks = stateCopy[action.task.todoListId]
            let newTask = [action.task, ...tasks]
            stateCopy[action.task.todoListId] = newTask
            return stateCopy;
        }
        case "CHANGE-TASK-STATUS": {
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(el => el.id === action.taskId
                        ? {...el, status: action.status}
                        : el)
            }
        }
        case "CHANGE-TASK-TITLE": {
            return {
                ...state, [action.todolistId]: state[action.todolistId]
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
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }


        default:
            return state;
    }
}