import {addTaskTC, removeTaskTC, tasksReducer, TasksStateType, updateTask} from './tasks-reducer';
import {TaskStatuses, TodoTaskPriorities} from '../api/todolist-api';
import {addTodolistTC, removeTodolistTC} from './todolists-reducer';

let startState: TasksStateType = {};
beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1',
                title: 'CSS',
                description: '',
                status: TaskStatuses.New,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                entityTaskStatus: 'idle'
            },
            {
                id: '2',
                title: 'JS',
                description: '',
                status: TaskStatuses.Completed,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                entityTaskStatus: 'idle'
            },
            {
                id: '3',
                title: 'React',
                description: '',
                status: TaskStatuses.New,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId1',
                order: 0,
                addedDate: '',
                entityTaskStatus: 'idle'
            }
        ],
        'todolistId2': [
            {
                id: '1',
                title: 'bread',
                description: '',
                status: TaskStatuses.New,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                entityTaskStatus: 'idle'
            },
            {
                id: '2',
                title: 'milk',
                description: '',
                status: TaskStatuses.Completed,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                entityTaskStatus: 'idle'
            },
            {
                id: '3',
                title: 'tea',
                description: '',
                status: TaskStatuses.New,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: 'todolistId2',
                order: 0,
                addedDate: '',
                entityTaskStatus: 'idle'
            }
        ]
    }
});
test('correct task should be deleted from correct array', () => {

    const action = removeTaskTC.fulfilled({taskId: '2', todoListId: 'todolistId2'}, 'requestId', {
        taskId: '2',
        todoListId: 'todolistId2'
    });

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(2);
    expect(endState['todolistId2'].every(t => t.id != '2')).toBeTruthy();
});

test('correct task should be added to correct array', () => {

    const action = addTaskTC.fulfilled(
        {
            todoListId: 'todolistId2',
            title: 'milk',
            status: TaskStatuses.New,
            addedDate: '',
            deadline: '',
            description: '',
            order: 0,
            priority: 0,
            startDate: '',
            id: 'id exists'

        }, 'requestId', {taskTitle: 'milk', todoListId: 'todolistId2'});


    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][0].title).toBe('milk');
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
})
test('status of specified task should be changed', () => {
    let updateModel = {taskId: '2', model: {status: TaskStatuses.New}, todoListId: 'todolistId2'}
    const action = updateTask.fulfilled(updateModel, 'requestId', updateModel)
    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New);
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.Completed);
})

test('title of specified task should be changed', () => {
    let updateModel = {taskId: '3', model: {title: 'green tea'}, todoListId: 'todolistId2'}
    const action = updateTask.fulfilled(updateModel,'requestId',updateModel)

    const endState = tasksReducer(startState, action);
    expect(endState['todolistId2'][2].title).toBe('green tea')
    expect(endState['todolistId1'][2].title).toBe('React')
})

test('new property with array should be added when new todolist is added', () => {
    let payload = {
        todolist: {
            id: '112',
            addedDate: '',
            order: 0,
            title: 'new todolist'
        }
    }
    const action = addTodolistTC.fulfilled(payload, 'requestId', payload.todolist.title);
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2');
    if (!newKey) {
        throw Error('new key should be added')
    }
    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('property with todolistId should be deleted', () => {

    const action = removeTodolistTC.fulfilled({todoListId: 'todolistId2'},'requestId', 'todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
});

