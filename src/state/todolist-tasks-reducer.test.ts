import {addTodolistTC, TodolistDomainType, todoListsReducer} from './todolists-reducer';
import {tasksReducer, TasksStateType} from './tasks-reducer';
import {TodolistType} from '../api/todolist-api';

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];
    let todolist:TodolistType = {
        id: '12',
        addedDate: '',
        order: 0,
        title: 'new todolist'
    }
    const action = addTodolistTC.fulfilled({todolist}, 'requestId',todolist.title);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
