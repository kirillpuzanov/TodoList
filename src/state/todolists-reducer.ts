import {todolistApi, TodolistType} from '../api/todolist-api';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AppRootStateType} from './Store';
import {
    RequestStatusType,
    setAppErrorAC,
    SetAppErrorACType,
    setAppStatusAC,
    SetAppStatusACType
} from '../app/ app-reducer';
import {handleServerError} from '../utils/error-utils';

//action's
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTitleTodolistAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeFilterTodolistAC = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filter
} as const)
export const setTodoListAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS',
    id,
    entityStatus
} as const)

//thunk's
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

export const getTodolistsTC = (): ThunkType => (dispatch: ThunkDispatch<AppRootStateType, unknown, ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    todolistApi.getTodolists()
        .then((res) => {
            dispatch(setTodoListAC(res.data));
            dispatch(setAppStatusAC('succeeded'));
        })
        .catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC('failed'))
        })
}

export const createTodolistTC = (title: string): ThunkType => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'));
        todolistApi.createTodolist(title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTodolistAC(res.data.data.item));
                    dispatch(setAppStatusAC('succeeded'));
                } else {
                    handleServerError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
                dispatch(setAppStatusAC('failed'))
            })
            // альтернативный вариант от task-reducer
            .finally(() => {
                dispatch(setAppStatusAC('failed'))
            })
    }
}

export const changeTitleTodolistTC = (todoListId: string, newTitle: string): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    dispatch(changeTodolistEntityStatusAC(todoListId, 'loading'))
    todolistApi.updateTodolist(todoListId, newTitle)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTitleTodolistAC(todoListId, newTitle));
                dispatch(setAppStatusAC('succeeded'));
                dispatch(changeTodolistEntityStatusAC(todoListId, 'succeeded'))
            } else {
                handleServerError(res.data, dispatch)
            }
        })
        .catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC('failed'))
        })
}

export const removeTodolistTC = (todolistId: string): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'));
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    todolistApi.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId));
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

// state
const initialState: Array<TodolistDomainType> = []

export const todoListsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id != action.todolistId)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'All', entityStatus: 'idle'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(el => el.id === action.id ? {...el, title: action.title} : el)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
        }
        case 'SET-TODOLISTS': {
            return action.todolists.map(tl => ({...tl, filter: 'All', entityStatus: 'idle'}))
        }
        case 'CHANGE-TODOLIST-ENTITY-STATUS': {
            return state.map(el => el.id === action.id ? {...el, entityStatus: action.entityStatus} : el)

        }
        default:
            return state;
    }
}

//type's
export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}

type ActionsType =
    | RemoveTLActionType
    | AddTLActionType
    | SetTodolistsACType
    | ReturnType<typeof changeTitleTodolistAC>
    | ReturnType<typeof changeFilterTodolistAC>
    | SetAppStatusACType
    | SetAppErrorACType
    | changeTodolistEntityStatusACType


export type AddTLActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTLActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsACType = ReturnType<typeof setTodoListAC>;
export type changeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>

