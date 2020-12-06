import {TaskStatuses, TaskType, todolistApi, TodoTaskPriorities} from '../api/todolist-api';
import {AppRootStateType, ThunkError} from './Store';
import {RequestStatusType,} from '../app/ app-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {addTodolistTC, getTodolists, removeTodolistTC} from './todolists-reducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {appActions} from '../commonAcnions/appActions';


export type TasksStateType = { [key: string]: Array<TaskDomainType> }
export type TaskDomainType = TaskType & { entityTaskStatus: RequestStatusType }


export const getTasks = createAsyncThunk('tasks/getTasks', async (todoListId: string, {dispatch}) => {
    dispatch(appActions.setAppStatusAC({status: 'loading'}))
    const res = await todolistApi.getTasks(todoListId)
    const tasks = res.data.items;
    dispatch(appActions.setAppStatusAC({status: 'succeeded'}))
    return {tasks, todoListId: todoListId};
});

export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: { taskId: string, todoListId: string }, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}))
    thunkAPI.dispatch(changeTaskEntityStatus({id: param.taskId, todoListId: param.todoListId, entityStatus: 'loading'}))
    const res = await todolistApi.deleteTask(param.taskId, param.todoListId)
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}))
            return {taskId: param.taskId, todoListId: param.todoListId}
        } else {
            handleServerAppError(res.data, thunkAPI)
        }
    } catch (err) {
        thunkAPI.dispatch(appActions.setAppStatusAC({status: 'failed'}))
        return handleServerNetworkError(err.message, thunkAPI)
    }
});

export const addTaskTC = createAsyncThunk<TaskType, { taskTitle: string, todoListId: string }, ThunkError>('tasks/addTask', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistApi.createTask(param.taskTitle, param.todoListId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}))
            return res.data.data.item
        } else {
            return handleServerAppError(res.data, thunkAPI)
        }
    } catch (err) {
        return handleServerNetworkError(err.message, thunkAPI)
    }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (param: { taskId: string, model: UpdateDomainTaskModelType, todoListId: string }, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}))
    thunkAPI.dispatch(changeTaskEntityStatus({id: param.taskId, todoListId: param.todoListId, entityStatus: 'loading'}))
    const state = thunkAPI.getState() as AppRootStateType;
    const task = state.tasks[param.todoListId].find(t => t.id === param.taskId)
    if (task) {
        try {
            const res = await todolistApi.updateTask(param.taskId, {
                status: task.status,
                title: task.title,
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                ...param.model
            }, param.todoListId)

            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}))
                thunkAPI.dispatch(changeTaskEntityStatus({
                    id: param.taskId,
                    todoListId: param.todoListId,
                    entityStatus: 'succeeded'
                }))
                return param
            } else {
                return handleServerAppError(res.data, thunkAPI)
            }
        } catch (err) {
            return handleServerNetworkError(err.message, thunkAPI)
        }
    }
})


const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        changeTaskEntityStatus(state, action: PayloadAction<{ id: string, todoListId: string, entityStatus: RequestStatusType }>) {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.id)
            tasks[index].entityTaskStatus = action.payload.entityStatus
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.todoListId]
        });
        builder.addCase(getTodolists.fulfilled, (state, action) => {
            action.payload.todolists.forEach((tl) => state[tl.id] = [])
        });
        builder.addCase(getTasks.fulfilled, (state, action) => {
            state[action.payload.todoListId] = action.payload.tasks.map(t => ({...t, entityTaskStatus: 'idle'}))
        });
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks.splice(index, 1);
        });
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift({...action.payload, entityTaskStatus: 'idle'})
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index] = {...tasks[index], ...action.payload.model}
        });
    }
})
export const tasksReducer = slice.reducer;
export const {changeTaskEntityStatus} = slice.actions;

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TodoTaskPriorities
    startDate?: string
    deadline?: string
    todoListId?: string
}

