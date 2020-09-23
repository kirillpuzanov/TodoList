import {FilterValuesType, ToDoListType} from "../App";
import {v1} from "uuid";


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
type ActionsType = RemoveTLActionType | AddTLActionType | ChangeTitleTLActionType | ChangeFilterTLActionType ;

export const RemoveTodolistAC = (todolistId: string): RemoveTLActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const AddTodolistAC = (title: string): AddTLActionType => {
    return {type: 'ADD-TODOLIST', title: title, todolistId: v1()}
}
export const ChangeTitleTodolistAC = (id: string, title: string): ChangeTitleTLActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}

export const ChangeFilterTodolistAC = (id: string, filter: FilterValuesType): ChangeFilterTLActionType => {
    return {type: "CHANGE-TODOLIST-FILTER", id: id, filter: filter}
}

export let todoListId1 = v1();
export let todoListId2 = v1();

const initialState: Array<ToDoListType> = []

export const todoListsReducer = (state: Array<ToDoListType> = initialState, action: ActionsType): Array<ToDoListType> => {

    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id != action.id)
        }

        case 'ADD-TODOLIST': {
            let newTodoList: ToDoListType = {id: action.todolistId, title: action.title, filter: "All"}
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
        default:
            return state;
    }
}