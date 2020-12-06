import {todolistApi, TodolistType} from '../api/todolist-api';
import {ThunkError} from './Store';
import {RequestStatusType} from '../app/ app-reducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {appActions} from '../commonAcnions/appActions';


export const getTodolists = createAsyncThunk<{ todolists: TodolistType[] }, undefined, ThunkError>
('todolists/getTodolists', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}));
    const res = await todolistApi.getTodolists()
    try {
        thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
        return {todolists: res.data};
    } catch (err) {
        return handleServerNetworkError(err.message, thunkAPI)
    }
});


export const addTodolistTC = createAsyncThunk<{ todolist: TodolistType }, string, ThunkError>
('todolists/addTodolists', async (title, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}));
    const res = await todolistApi.createTodolist(title)
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
            return {todolist: res.data.data.item};
        } else {
            return handleServerAppError(res.data, thunkAPI, false)
        }
    } catch (err) {
        return handleServerNetworkError(err.message, thunkAPI, false)
    }
});

export const removeTodolistTC = createAsyncThunk<{ todoListId: string }, string, ThunkError>('todolists/removeTodolist', async (todolistId, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}));
    thunkAPI.dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
    const res = await todolistApi.deleteTodolist(todolistId);
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}))
            return {todoListId: todolistId};
        } else {
            return handleServerAppError(res.data, thunkAPI)
        }
    } catch (err) {
        return handleServerNetworkError(err.message, thunkAPI)
    }
});


export const changeTitleTodolistTC = createAsyncThunk<{ todoListId: string, newTitle: string }, { todoListId: string, newTitle: string }, ThunkError>
('todolists/changeTitleTodolist', async (param: { todoListId: string, newTitle: string }, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}));
    thunkAPI.dispatch(changeTodolistEntityStatusAC({id: param.todoListId, entityStatus: 'loading'}))
    const res = await todolistApi.updateTodolist(param.todoListId, param.newTitle)
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}));
            thunkAPI.dispatch(changeTodolistEntityStatusAC({id: param.todoListId, entityStatus: 'succeeded'}))
            return {todoListId: param.todoListId, newTitle: param.newTitle};
        } else {
            return handleServerAppError(res.data, thunkAPI)
        }
    } catch (err) {
        return handleServerNetworkError(err.message, thunkAPI)
    }
});


const slice = createSlice({
    name: 'todolists',
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeFilterTodolistAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            // state.map(el => el.id === action.payload.id ? {...el, filter: action.payload.filter} : el)
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            // state.map(el => el.id === action.payload.id ? {...el, entityStatus: action.payload.entityStatus} : el)
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        }
    },
    extraReducers: builder => {
        builder.addCase(getTodolists.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'All', entityStatus: 'idle'}))
        })
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'All', entityStatus: 'idle'})
        })
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            state.splice(index, 1)
        })
        builder.addCase(changeTitleTodolistTC.fulfilled,(state, action)=> {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            state[index].title = action.payload.newTitle
        })
    }
})

export const todoListsReducer = slice.reducer;
export const {
    changeFilterTodolistAC,
    changeTodolistEntityStatusAC
} = slice.actions;

//type's
export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}
