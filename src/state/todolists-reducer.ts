import {todolistApi, TodolistType} from '../api/todolist-api';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AppRootStateType} from './Store';
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from '../app/ app-reducer';
import {handleServerError} from '../utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';


// state
const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todoolists',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
            // state.filter(tl => tl.id != action.payload.todolistId)
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state.splice(index, 1)
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'All', entityStatus: 'idle'})
        },
        changeTitleTodolistAC(state, action: PayloadAction<{ id: string, title: string }>) {
            // state.map(el => el.id === action.payload.id ? {...el, title: action.payload.title} : el)
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeFilterTodolistAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            // state.map(el => el.id === action.payload.id ? {...el, filter: action.payload.filter} : el)
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            // state.map(el => el.id === action.payload.id ? {...el, entityStatus: action.payload.entityStatus} : el)
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].entityStatus = action.payload.entityStatus
        },
        setTodoListAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'All', entityStatus: 'idle'}))
        },
    }
})

export const todoListsReducer = slice.reducer;
export const {removeTodolistAC, addTodolistAC, changeTitleTodolistAC, changeFilterTodolistAC, setTodoListAC, changeTodolistEntityStatusAC} = slice.actions;

//thunk's
type ThunkType = ThunkAction<void, AppRootStateType, unknown, any>
export const getTodolistsTC = (): ThunkType => (dispatch: ThunkDispatch<AppRootStateType, unknown, any>) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    todolistApi.getTodolists()
        .then((res) => {
            dispatch(setTodoListAC({todolists: res.data}));
            dispatch(setAppStatusAC({status: 'succeeded'}));
        })
        .catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC({status: 'failed'}))
        })
}

export const createTodolistTC = (title: string): ThunkType => {
    return (dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}));
        todolistApi.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC({todolist: res.data.data.item}));
                    dispatch(setAppStatusAC({status: 'succeeded'}));
                } else {
                    handleServerError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
                dispatch(setAppStatusAC({status: 'failed'}))
            })
            // альтернативный вариант от task-reducer
            .finally(() => {
                dispatch(setAppStatusAC({status: 'failed'}))
            })
    }
}

export const changeTitleTodolistTC = (todoListId: string, newTitle: string): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatusAC({id: todoListId, entityStatus: 'loading'}))
    todolistApi.updateTodolist(todoListId, newTitle)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTitleTodolistAC({id: todoListId, title: newTitle}));
                dispatch(setAppStatusAC({status: 'succeeded'}));
                dispatch(changeTodolistEntityStatusAC({id: todoListId, entityStatus: 'succeeded'}))
            } else {
                handleServerError(res.data, dispatch)
            }
        })
        .catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC({status: 'failed'}))
        })
}

export const removeTodolistTC = (todolistId: string): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}));
    dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
    todolistApi.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC({todolistId: todolistId}));
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


//type's
export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}

// type ActionsType =
//     | RemoveTLActionType
//     | AddTLActionType
//     | SetTodolistsACType
//     | ReturnType<typeof changeTitleTodolistAC>
//     | ReturnType<typeof changeFilterTodolistAC>
//     | SetAppStatusACType
//     | SetAppErrorACType
//     | changeTodolistEntityStatusACType


// export type AddTLActionType = ReturnType<typeof addTodolistAC>;
// export type RemoveTLActionType = ReturnType<typeof removeTodolistAC>;
// export type SetTodolistsACType = ReturnType<typeof setTodoListAC>;
// export type changeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>

