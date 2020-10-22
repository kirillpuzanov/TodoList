import React, {useReducer} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodolistAC,
    ChangeFilterTodolistAC,
    ChangeTitleTodolistAC,
    FilterValuesType,
    RemoveTodolistAC,
    todoListsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";
import {TaskStatuses, TaskType, TodoTaskPriorities} from "./api/todolist-api";


function AppWithReducers() {

    let todoListId1 = v1();
    let todoListId2 = v1();
// стэйт который обрабатывает тудулисты
    let [todoLists, dispatchTodolists] = useReducer(todoListsReducer, [
        {id: todoListId1, title: 'What to learn?', filter: 'Active', addedDate: '', order: 0},
        {id: todoListId2, title: 'What to buy?', filter: 'Completed',addedDate: '', order: 1}
    ]);

// стэйт который обрабатывает таски
    let [tasksObj, dispatchTasks] = useReducer(tasksReducer, {
        [todoListId1]: [
            {
                id: v1(),
                title: 'HTML&CSS',
                status: TaskStatuses.Completed,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoListId1,
                order: 0,
                addedDate: '',
                description: ''
            },
            {
                id: v1(),
                title: 'JS',
                status: TaskStatuses.New,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoListId1,
                order: 0,
                addedDate: '',
                description: ''
            },

        ],
        [todoListId2]: [
            {
                id: v1(),
                title: 'Mi band 5',
                status: TaskStatuses.Completed,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoListId2,
                order: 0,
                addedDate: '',
                description: ''
            },
            {
                id: v1(),
                title: 'Mouse',
                status: TaskStatuses.New,
                priority: TodoTaskPriorities.Low,
                startDate: '',
                deadline: '',
                todoListId: todoListId2,
                order: 0,
                addedDate: '',
                description: ''
            },
        ]
    })

    function removeTask(id: string, todoListId: string) {
        const action = removeTaskAC(id, todoListId);
        dispatchTasks(action);
    }

    function addTask() {
        const action = addTaskAC({id: v1(),
            title: 'HTML&CSS',
            status: TaskStatuses.Completed,
            priority: TodoTaskPriorities.Low,
            startDate: '',
            deadline: '',
            todoListId: todoListId1,
            order: 0,
            addedDate: '',
            description: ''});
        dispatchTasks(action);
    }


    function changeStatus(id: string, status: TaskStatuses, todoListId: string) {
        const action = changeTaskStatusAC(id, status, todoListId);
        dispatchTasks(action);
    }


    function changeTaskTitle(id: string, newTitle: string, todoListId: string) {
        const action = changeTaskTitleAC(id, newTitle, todoListId);
        dispatchTasks(action);
    }

    //....................функции для тудулистов

    function changeFilter(todoListId: string, value: FilterValuesType) {
        const action = ChangeFilterTodolistAC(todoListId, value);
        dispatchTodolists(action);
    }

    function removeTodoList(todoListId: string) {
        const action = RemoveTodolistAC(todoListId);
        dispatchTodolists(action);
        dispatchTasks(action);

    }

    function changeTodoListTitle(todoListId: string, newTitle: string) {
        const action = ChangeTitleTodolistAC(todoListId, newTitle);
        dispatchTodolists(action);
    }

    function addTodoList(title: string) {
        const action = AddTodolistAC(title);
        dispatchTodolists(action);
        dispatchTasks(action);
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoLists.map((tl) => {
                            let allTodolistTasks = tasksObj[tl.id];
                            let tasksForTodoList = allTodolistTasks;
                            if (tl.filter === 'Completed') {
                                tasksForTodoList = allTodolistTasks.filter(t => t.status === TaskStatuses.Completed);
                            }
                            if (tl.filter === 'Active') {
                                tasksForTodoList = allTodolistTasks.filter(t => t.status === TaskStatuses.New);
                            }
                            return <Grid item>
                                <Paper style={{padding: '10px'}}>
                                    <TodoList
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodoList}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeStatus={changeStatus}
                                        removeTodoList={removeTodoList}
                                        filter={tl.filter}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodoListTitle={changeTodoListTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithReducers;
