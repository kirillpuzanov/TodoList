import {AddTLActionType, RemoveTLActionType, SetTodolistsACType} from './todolists-reducer';
import {TaskStatuses, TaskType, todolistApi} from '../api/todolist-api';
import {ThunkAction} from 'redux-thunk';
import {AppRootStateType} from './Store';
import {
    RequestStatusType,
    setAppErrorAC,
    SetAppErrorACType,
    setAppStatusAC,
    SetAppStatusACType
} from '../app/ app-reducer';
import {handleServerError} from '../utils/error-utils';

//actions
export const removeTaskAC = (taskId: string, todoListId: string) => {
    return ({type: 'REMOVE-TASK', taskId, todoListId} as const)
}
export const addTaskAC = (task: TaskType) => {
    return ({type: 'ADD-TASK', task} as const)
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string) => {
    return ({type: 'CHANGE-TASK-STATUS', taskId, status, todolistId} as const)
}
export const changeTaskTitleAC = (taskId: string, taskTitle: string, todolistId: string) => {
    return ({type: 'CHANGE-TASK-TITLE', taskId, taskTitle, todolistId} as const)
}
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => {
    return ({type: 'SET-TASKS', tasks, todolistId} as const)
}

/////// thunk's
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

export const getTasksTC = (todolistId: string): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        }).catch((err) => {
        dispatch(setAppErrorAC(err.message))
        dispatch(setAppStatusAC('failed'))
    })
}
export const removeTaskTC = (taskId: string, todolistId: string): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistApi.deleteTask(taskId, todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerError(res.data, dispatch)
            }
        }).catch((err) => {
        dispatch(setAppErrorAC(err.message))
        dispatch(setAppStatusAC('failed'))
    })
}
export const addTaskTC = (taskTitle: string, todolistId: string): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistApi.createTask(taskTitle, todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerError(res.data, dispatch)
            }
        })
        .catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC('failed'))
        })
}

////////  с ипользованием try catch
// export const addTaskTC = (taskTitle: string, todolistId: string): ThunkType => async (dispatch) => {
//     try {
//         dispatch(setAppStatusAC('loading'))
//         let res = await todolistApi.createTask(taskTitle, todolistId)
//
//         if (res.data.resultCode === 0) {
//             dispatch(addTaskAC(res.data.data.item))
//             dispatch(setAppStatusAC('succeeded'))
//         } else {
//             if (res.data.messages.length) {
//                 dispatch(setAppErrorAC(res.data.messages[0]))
//             } else {
//                 dispatch(setAppErrorAC('Some error occurred'))
//             }
//             dispatch(setAppStatusAC('failed'))
//         }
//     } catch (err) {
//         dispatch(setAppErrorAC(err.message))
//         dispatch(setAppStatusAC('failed'))
//     }
// }

export const updateTaskStatusTC = (taskId: string, status: TaskStatuses, todolistId: string): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC('loading'))
    const tasks = getState().tasks[todolistId]
    const currentTask = tasks.find(t => t.id === taskId)
    if (currentTask) {
        todolistApi.updateTask(taskId, {
            status: status,
            deadline: currentTask.deadline,
            description: currentTask.description,
            priority: currentTask.priority,
            startDate: currentTask.startDate,
            title: currentTask.title
        }, todolistId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTaskStatusAC(taskId, status, todolistId))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerError(res.data, dispatch)
                }
            }).catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC('failed'))
        })
    }
}
export const changeTaskTitleTC = (id: string, newTitle: string, todoListId: string): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC('loading'))
    const tasks = getState().tasks[todoListId]
    const currentTask = tasks.find(el => el.id === id)
    if (currentTask) {
        todolistApi.updateTask(id, {
            status: 0,
            deadline: currentTask.deadline,
            description: currentTask.description,
            priority: currentTask.priority,
            startDate: currentTask.startDate,
            title: newTitle
        }, todoListId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTaskTitleAC(id, newTitle, todoListId))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
                dispatch(setAppStatusAC('failed'))
            })
    }
}


export type TasksStateType = {
    [key: string]: Array<TaskType>
}
// export type TaskDomainType = TaskType & {entityTaskStatus: RequestStatusType}

const initialState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(el => el.id !== action.taskId)
            }
        }
        case 'ADD-TASK': {
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        }
        case 'CHANGE-TASK-STATUS': {
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(el => el.id === action.taskId
                        ? {...el, status: action.status}
                        : el)
            }
        }
        case 'CHANGE-TASK-TITLE': {
            return {
                ...state, [action.todolistId]: state[action.todolistId]
                    .map(el => el.id === action.taskId
                        ? {...el, title: action.taskTitle}
                        : el)
            }
        }
        case 'ADD-TODOLIST': {
            return {...state, [action.todolist.id]: []}
        }
        case 'REMOVE-TODOLIST': {
            const stateCopy = {...state};
            delete stateCopy[action.todolistId]
            return stateCopy;
        }
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: action.tasks}
        default:
            return state;
    }
}

type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof changeTaskStatusAC>
    | ReturnType<typeof changeTaskTitleAC>
    | ReturnType<typeof setTasksAC>
    | AddTLActionType
    | RemoveTLActionType
    | SetTodolistsACType
    | SetAppStatusACType
    | SetAppErrorACType;
