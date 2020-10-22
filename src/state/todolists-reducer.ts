import {v1} from "uuid";
import {todolistApi, TodolistType} from "../api/todolist-api";
import {ThunkAction, ThunkDispatch} from "redux-thunk";
import {AppRootStateType} from "./Store";

export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type TodolistDomainType = TodolistType & { filter: FilterValuesType }

export type RemoveTLActionType = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTLActionType = {
    type: 'ADD-TODOLIST'
    title: string
    todolistId: string
}
export type ChangeTitleTLActionType = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string

}
export type ChangeFilterTLActionType = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    filter: FilterValuesType
}

export type SetTodolistsACType = ReturnType<typeof setTodoListAC>


type ActionsType =
    RemoveTLActionType
    | AddTLActionType
    | ChangeTitleTLActionType
    | ChangeFilterTLActionType
    | SetTodolistsACType;

export const RemoveTodolistAC = (todolistId: string): RemoveTLActionType => {
    return ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
}
export const AddTodolistAC = (title: string): AddTLActionType => {
    return ({type: 'ADD-TODOLIST', title: title, todolistId: v1()} as const)
}
export const ChangeTitleTodolistAC = (id: string, title: string): ChangeTitleTLActionType => {
    return ({type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const)
}

export const ChangeFilterTodolistAC = (id: string, filter: FilterValuesType): ChangeFilterTLActionType => {
    return ({type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter} as const)
}

export const setTodoListAC = (todolists: Array<TodolistType>) => {
    return ({type: 'SET-TODOLISTS', todolists} as const)
}

type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>


export const fetchTodolistsTC = (): ThunkType => (dispatch: ThunkDispatch<AppRootStateType, unknown, ActionsType>) => {
    todolistApi.getTodolists()
        .then((res) => {
            dispatch(setTodoListAC(res.data))
        })
}

export let todoListId1 = v1();
export let todoListId2 = v1();

const initialState: Array<TodolistDomainType> = []

export const todoListsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {

    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id != action.id)
        }

        case 'ADD-TODOLIST': {
            let newTodoList: TodolistDomainType = {
                id: action.todolistId, title: action.title, filter: "All", addedDate: '',
                order: 0
            }
            return [
                ...state.map(el => ({...el})),
                newTodoList
            ]
        }

        case 'CHANGE-TODOLIST-TITLE': {
            const stateCopy2 = [...state.map(el => ({...el}))]
            const TodoList = stateCopy2.find(tl => tl.id === action.id)
            if (TodoList) {
                //если нашелся,изменим ему заголовок
                TodoList.title = action.title
            }
            return stateCopy2
        }

        case 'CHANGE-TODOLIST-FILTER': {
            const stateCopy3 = [...state.map(el => ({...el}))]
            const todoList = stateCopy3.find(tl => tl.id === action.id);
            if (todoList) {
                todoList.filter = action.filter
            }
            return stateCopy3;
        }
        case "SET-TODOLISTS": {
            return action.todolists.map(tl => ({
                ...tl,
                filter: 'All'
            }))
        }

        default:
            return state;
    }
}