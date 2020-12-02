import {TaskStatuses, TaskType, todolistApi} from '../api/todolist-api';
import {ThunkAction} from 'redux-thunk';
import {AppRootStateType} from './Store';
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from '../app/ app-reducer';
import {handleServerError} from '../utils/error-utils';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {addTodolistAC, removeTodolistAC, setTodoListAC} from './todolists-reducer';


export type TasksStateType = { [key: string]: Array<TaskDomainType> }
export type TaskDomainType = TaskType & { entityTaskStatus: RequestStatusType }


export const getTasksTC = createAsyncThunk('tasks/getTasks', (todoListId: string, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    return todolistApi.getTasks(todoListId)
        .then((res) => {
            const tasks = res.data.items;
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {tasks, todoListId: todoListId};
        }).catch((err) => {
            dispatch(setAppStatusAC({status: 'failed'}))
            dispatch(setAppErrorAC(err.message))
            return rejectWithValue(err.message)
        })
});

export const removeTaskTC = createAsyncThunk('tasks/removeTask', (param: { taskId: string, todoListId: string }, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatus({id: param.taskId, todoListId: param.todoListId, entityStatus: 'loading'}))
    return todolistApi.deleteTask(param.taskId, param.todoListId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                return {taskId: param.taskId, todoListId: param.todoListId}
            } else {
                handleServerError(res.data, dispatch)
                return rejectWithValue('some error')
            }
        }).catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC({status: 'failed'}))
            return rejectWithValue(err.message)
        })
});

export const addTaskTC = createAsyncThunk('tasks/addTask',
    (param: { taskTitle: string, todoListId: string}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    return todolistApi.createTask(param.taskTitle, param.todoListId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
               return {task: res.data.data.item}
            } else {
                handleServerError(res.data, dispatch)
                return rejectWithValue('some error')
            }
        }).catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC({status: 'failed'}))
            return rejectWithValue(err.message)
        })
});


export const updateTaskStatusTC = (taskId: string, status: TaskStatuses, todoListId: string): ThunkType => (dispatch, getState: () => AppRootStateType) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTaskEntityStatus({id: taskId, todoListId: todoListId, entityStatus: 'loading'}))
    const tasks = getState().tasks[todoListId]
    const currentTask = tasks.find(t => t.id === taskId)
    if (currentTask) {
        todolistApi.updateTask(taskId, {
            status: status,
            deadline: currentTask.deadline,
            description: currentTask.description,
            priority: currentTask.priority,
            startDate: currentTask.startDate,
            title: currentTask.title
        }, todoListId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(changeTaskStatusAC({taskId, status, todoListId: todoListId}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    dispatch(changeTaskEntityStatus({id: taskId, todoListId: todoListId, entityStatus: 'succeeded'}))
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
    dispatch(changeTaskEntityStatus({id, todoListId: todoListId, entityStatus: 'loading'}))
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
                    dispatch(changeTaskTitleAC({taskId: id, taskTitle: newTitle, todoListId: todoListId}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                    dispatch(changeTaskEntityStatus({id, todoListId: todoListId, entityStatus: 'succeeded'}))
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




const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        changeTaskStatusAC(state, action: PayloadAction<{ taskId: string, status: TaskStatuses, todoListId: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index].status = action.payload.status
        },
        changeTaskTitleAC(state, action: PayloadAction<{ taskId: string, taskTitle: string, todoListId: string }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index].title = action.payload.taskTitle
        },
        changeTaskEntityStatus(state, action: PayloadAction<{ id: string, todoListId: string, entityStatus: RequestStatusType }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.id)
            tasks[index].entityTaskStatus = action.payload.entityStatus
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todoListId]
        });
        builder.addCase(setTodoListAC, (state, action) => {
            action.payload.todolists.forEach((tl) => {
                state[tl.id] = []
            })
        });
        builder.addCase(getTasksTC.fulfilled, (state, action) => {
            state[action.payload.todoListId] = action.payload.tasks.map(t => ({...t, entityTaskStatus: 'idle'}))
        });
        builder.addCase(removeTaskTC.fulfilled, (state,action)=> {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(index, 1);
        });
        builder.addCase(addTaskTC.fulfilled, (state,action)=> {
            state[action.payload.task.todoListId].unshift({...action.payload.task, entityTaskStatus: 'idle'})
        });

    }
})
export const tasksReducer = slice.reducer;
export const { changeTaskStatusAC, changeTaskTitleAC, changeTaskEntityStatus} = slice.actions;

/////// thunk's
type ThunkType = ThunkAction<void, AppRootStateType, unknown, any>

