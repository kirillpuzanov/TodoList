import {todolistApi, TodolistType} from "../api/todolist-api";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "./Store";

//actions
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTitleTodolistAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeFilterTodolistAC = (id: string, filter: FilterValuesType) => ({
    type: "CHANGE-TODOLIST-FILTER",
    id,
    filter
} as const)
export const setTodoListAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)

//thunk's
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

export const getTodolistsTC = (): ThunkType => (dispatch: ThunkDispatch<AppRootStateType, unknown, ActionsType>) => {
    todolistApi.getTodolists()
        .then((res) => {
            dispatch(setTodoListAC(res.data))
        })
}
export const createTodolistTC = (title: string): ThunkType => {
    return (dispatch) => {
        todolistApi.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC(res.data.data.item));
            })
    }
}
export const changeTitleTodolistTC = (todoListId: string, newTitle: string): ThunkType => (dispatch) => {
    todolistApi.updateTodolist(todoListId, newTitle)
        .then(() => {
            dispatch(changeTitleTodolistAC(todoListId, newTitle))
        })

}
export const removeTodolistTC = (todolistId: string): ThunkType => (dispatch) => {
    todolistApi.deleteTodolist(todolistId)
        .then(() => {
            dispatch(removeTodolistAC(todolistId))
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
            return [{...action.todolist, filter: 'All'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map( el => el.id === action.id? {...el, title:action.title}: el)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map( el => el.id === action.id? {...el, filter:action.filter}: el)
        }
        case "SET-TODOLISTS": {
            return action.todolists.map(tl => ({...tl, filter: 'All'}))
        }
        default:
            return state;
    }
}

export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type TodolistDomainType = TodolistType & { filter: FilterValuesType }

type ActionsType =
    | RemoveTLActionType
    | AddTLActionType
    | SetTodolistsACType
    | ReturnType<typeof changeTitleTodolistAC>
    | ReturnType<typeof changeFilterTodolistAC>

export type AddTLActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTLActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsACType = ReturnType<typeof setTodoListAC>;


