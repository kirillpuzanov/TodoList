import {v1} from "uuid";
import {
    AddTodolistAC,
    ChangeFilterTodolistAC,
    ChangeTitleTodolistAC,
    RemoveTodolistAC,
    todoListsReducer
} from "./todolists-reducer";
import {FilterValuesType, ToDoListType} from "../App";

let todolistId1: string;
let todolistId2: string;
let startState: Array<ToDoListType> = [];
beforeEach(() => {
     todolistId1 = v1();
     todolistId2 = v1();
     startState = [
        {id: todolistId1, title: "What to learn", filter: 'All'},
        {id: todolistId2, title: "What to buy", filter: 'All'}
    ]
})

test('correct todolist should be removed', () => {

    const endState = todoListsReducer(startState, RemoveTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let newTodolistTitle = "New Todolist";
    const endState = todoListsReducer(startState, AddTodolistAC(newTodolistTitle))

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolistTitle);
});

test('correct todolist should change it"s name', () => {
    let newTodolistTitle = "New Todolist";

    const endState = todoListsReducer(startState, ChangeTitleTodolistAC(todolistId2, newTodolistTitle));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "Completed";
    const endState = todoListsReducer(startState, ChangeFilterTodolistAC(todolistId2, newFilter));

    expect(endState[0].filter).toBe("All");
    expect(endState[1].filter).toBe(newFilter);
});



