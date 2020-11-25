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
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {addTodolistAC, setTodoListAC, removeTodolistAC} from './todolists-reducer';


export type TasksStateType = { [key: string]: Array<TaskDomainType> }
export type TaskDomainType = TaskType & { entityTaskStatus: RequestStatusType }
const initialState: TasksStateType = {}


const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todoListId: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(index, 1);
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityTaskStatus: 'idle'})
        },
        changeTaskStatusAC(state, action: PayloadAction<{ taskId: string, status: TaskStatuses, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index].status = action.payload.status
        },
        changeTaskTitleAC(state, action: PayloadAction<{ taskId: string, taskTitle: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index].title = action.payload.taskTitle
        },
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks.map(t => ({...t, entityTaskStatus: 'idle'}))
        },
        changeTaskEntityStatus(state, action: PayloadAction<{ id: string, todolistId: string, entityStatus: RequestStatusType }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.id)
            tasks[index].entityTaskStatus = action.payload.entityStatus
        },
    },
    extraReducers: (buielder) => {
        buielder.addCase(addTodolistAC, ((state, action) => {
            state[action.payload.todolist.id] = []
        }))
        buielder.addCase(removeTodolistAC, ((state, action) => {
            delete state[action.payload.todolistId]
        }))
        buielder.addCase(setTodoListAC, ((state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
        )
    }

})
export const tasksReducer = slice.reducer;
export const {
    removeTaskAC, addTaskAC, changeTaskStatusAC, changeTaskTitleAC,
    setTasksAC, changeTaskEntityStatus
} = slice.actions;

/////// thunk's
type ThunkType = ThunkAction<void, AppRootStateType, unknown, any>

export const getTasksTC = (todolistId: string): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistApi.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC({tasks: res.data.items, todolistId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        }).catch((err) => {
        dispatch(setAppErrorAC(err.message))
        dispatch(setAppStatusAC({status: 'failed'}))
    })
}
export const removeTaskTC = (taskId: string, todolistId: string): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatus({id: taskId, todolistId, entityStatus: 'loading'}))
    todolistApi.deleteTask(taskId, todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC({taskId, todoListId: todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerError(res.data, dispatch)
            }
        }).catch((err) => {
        dispatch(setAppErrorAC(err.message))
        dispatch(setAppStatusAC({status: 'failed'}))
    })
}
export const addTaskTC = (taskTitle: string, todolistId: string): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistApi.createTask(taskTitle, todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerError(res.data, dispatch)
            }
        })
        .catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC({status: 'failed'}))
        })
}

export const updateTaskStatusTC = (taskId: string, status: TaskStatuses, todolistId: string): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatus({id: taskId, todolistId, entityStatus: 'loading'}))
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
                    dispatch(changeTaskStatusAC({taskId, status, todolistId}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    dispatch(changeTaskEntityStatus({id: taskId, todolistId, entityStatus: 'succeeded'}))
                } else {
                    handleServerError(res.data, dispatch)
                }
            }).catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC({status: 'failed'}))
        })
    }
}
export const changeTaskTitleTC = (id: string, newTitle: string, todoListId: string): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatus({id, todolistId: todoListId, entityStatus: 'loading'}))
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
                    dispatch(changeTaskTitleAC({taskId: id, taskTitle: newTitle, todolistId: todoListId}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    dispatch(changeTaskEntityStatus({id, todolistId: todoListId, entityStatus: 'succeeded'}))
                } else {
                    handleServerError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
                dispatch(setAppStatusAC({status: 'failed'}))
            })
    }
}


// type ActionsType =
//     | ReturnType<typeof removeTaskAC>
//     | ReturnType<typeof addTaskAC>
//     | ReturnType<typeof changeTaskStatusAC>
//     | ReturnType<typeof changeTaskTitleAC>
//     | ReturnType<typeof setTasksAC>
//     | ReturnType<typeof changeTaskEntityStatus>
//     // | AddTLActionType
//     // | RemoveTLActionType
//     // | SetTodolistsACType
//     | SetAppStatusACType
//     | SetAppErrorACType;


//////// addTaskTC  с ипользованием try catch
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