import {v1} from "uuid";
import {
    addTodolistAC,
    changeFilterTodolistAC,
    changeTitleTodolistAC, FilterValuesType,
    removeTodolistAC, TodolistDomainType,
    todoListsReducer
} from "./todolists-reducer";
import {TodolistType} from "../api/todolist-api";





let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType> = [];
beforeEach(() => {
     todolistId1 = v1();
     todolistId2 = v1();
     startState = [
        {id: todolistId1,order:0,addedDate:'', title: "What to learn", filter: 'All'},
        {id: todolistId2,order:0,addedDate:'', title: "What to buy", filter: 'All'}
    ]
})

test('correct todolist should be removed', () => {

    const endState = todoListsReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let todolist:TodolistType = {
        title: 'New todolist',
        id: ' 123',
        addedDate: '',
        order:0
    };
    const endState = todoListsReducer(startState, addTodolistAC(todolist))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(todolist.title);
});

test('correct todolist should change it"s name', () => {
    let newTodolistTitle = "New Todolist";

    const endState = todoListsReducer(startState, changeTitleTodolistAC(todolistId2, newTodolistTitle));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "Completed";
    const endState = todoListsReducer(startState, changeFilterTodolistAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe("All");
    expect(endState[1].filter).toBe(newFilter);
});



