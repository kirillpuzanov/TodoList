import React, {useReducer, useState} from 'react';
import './App.css';
import {TasksType, TodoList} from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, IconButton, Typography, Toolbar, Container, Grid, Paper} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodolistAC,
    ChangeFilterTodolistAC,
    ChangeTitleTodolistAC,
    RemoveTodolistAC,
    todoListsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";


export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type ToDoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TasksStateType = {
    [key: string]: Array<TasksType>
}

function AppWithReducers() {

    let todoListId1 = v1();
    let todoListId2 = v1();
// стэйт который обрабатывает тудулисты
    let [todoLists, dispatchTodolists] = useReducer(todoListsReducer, [
        {id: todoListId1, title: 'What to learn?', filter: 'Active'},
        {id: todoListId2, title: 'What to buy?', filter: 'Completed'}
    ]);

// стэйт который обрабатывает таски
    let [tasksObj, dispatchTasks] = useReducer(tasksReducer, {
        [todoListId1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: false},
            {id: v1(), title: 'ReactJS', isDone: false},
            {id: v1(), title: 'Rest API', isDone: false},
            {id: v1(), title: 'GraphQL', isDone: false}
        ],
        [todoListId2]: [
            {id: v1(), title: 'Mi band 5', isDone: true},
            {id: v1(), title: 'Mouse', isDone: false},
            {id: v1(), title: 'Screwdrivers', isDone: false},
            {id: v1(), title: 'Phone for sister', isDone: false}
        ]
    })

    function removeTask(id: string, todoListId: string) {
        const action = removeTaskAC(id, todoListId);
        dispatchTasks(action);
    }

    function addTask(title: string, todoListId: string) {
        const action = addTaskAC(title, todoListId);
        dispatchTasks(action);
    }


    function changeStatus(id: string, isDone: boolean, todoListId: string) {
        const action = changeTaskStatusAC(id, isDone, todoListId);
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
        const action = ChangeTitleTodolistAC(todoListId,newTitle);
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
                            let tasksForTodoList = tasksObj[tl.id];
                            if (tl.filter === 'Completed') {
                                tasksForTodoList = tasksForTodoList.filter(t => t.isDone);
                            }
                            if (tl.filter === 'Active') {
                                tasksForTodoList = tasksForTodoList.filter(t => !t.isDone);
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
