import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    tasksReducer,
    TasksStateType
} from './tasks-reducer';
import {addTodolistAC, removeTodolistAC} from "./todolists-reducer";
import {TaskStatuses, TodoTaskPriorities} from "../api/todolist-api";
import {v1} from "uuid";

let startState: TasksStateType = {};
beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                description: '',
                status: TaskStatuses.New,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: "todolistId1",
                order: 0,
                addedDate: ''
            },
            {
                id: "2",
                title: "JS",
                description: '',
                status: TaskStatuses.Completed,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: "todolistId1",
                order: 0,
                addedDate: ''
            },
            {
                id: "3",
                title: "React",
                description: '',
                status: TaskStatuses.New,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: "todolistId1",
                order: 0,
                addedDate: ''
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                description: '',
                status: TaskStatuses.New,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: "todolistId2",
                order: 0,
                addedDate: ''
            },
            {
                id: "2",
                title: "milk",
                description: '',
                status: TaskStatuses.Completed,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: "todolistId2",
                order: 0,
                addedDate: ''
            },
            {
                id: "3",
                title: "tea",
                description: '',
                status: TaskStatuses.New,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: "todolistId2",
                order: 0,
                addedDate: ''
            }
        ]
    }
});
test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"].every(t => t.id != "2")).toBeTruthy();
});

test('correct task should be added to correct array', () => {

    const action = addTaskAC(
        {
            id: "2",
            title: "milk",
            description: '',
            status: TaskStatuses.New,
            priority: TodoTaskPriorities.Low,
            startDate: '',
            deadline: '',
            todoListId: "todolistId2",
            order: 0,
            addedDate: ''
        }
    );


    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("milk");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})
test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC("2", TaskStatuses.New, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
})

test('title of specified task should be changed', () => {

    const action = changeTaskTitleAC('3', 'green tea', 'todolistId2');
    const endState = tasksReducer(startState, action);
    expect(endState["todolistId2"][2].title).toBe('green tea')
    expect(endState["todolistId1"][2].title).toBe('React')
})

test('new property with array should be added when new todolist is added', () => {

    const action = addTodolistAC( {
        id: '112',
        addedDate: '',
        order: 0,
        title: 'new todolist'
    });
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }
    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {

    const action = removeTodolistAC("todolistId2");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});

