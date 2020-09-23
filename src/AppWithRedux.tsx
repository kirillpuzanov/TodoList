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
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/Store";


export type FilterValuesType = 'All' | 'Active' | 'Completed';
export type ToDoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TasksStateType = {
    [key: string]: Array<TasksType>
}

function AppWithRedux() {
    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootStateType, Array<ToDoListType>>(state => state.todolists);
    const tasks = useSelector<AppRootStateType, TasksStateType>
    (state => state.tasks);

    function removeTask(id: string, todoListId: string) {
        const action = removeTaskAC(id, todoListId);
        dispatch(action);
    }

    function addTask(title: string, todoListId: string) {
        const action = addTaskAC(title, todoListId);
        dispatch(action);
    }


    function changeStatus(id: string, isDone: boolean, todoListId: string) {
        const action = changeTaskStatusAC(id, isDone, todoListId);
        dispatch(action);
    }


    function changeTaskTitle(id: string, newTitle: string, todoListId: string) {
        const action = changeTaskTitleAC(id, newTitle, todoListId);
        dispatch(action);
    }

    //....................функции для тудулистов

    function changeFilter(todoListId: string, value: FilterValuesType) {
        const action = ChangeFilterTodolistAC(todoListId, value);
        dispatch(action);
    }

    function removeTodoList(todoListId: string) {
        const action = RemoveTodolistAC(todoListId);
        dispatch(action);


    }

    function changeTodoListTitle(todoListId: string, newTitle: string) {
        const action = ChangeTitleTodolistAC(todoListId, newTitle);
        dispatch(action);
    }

    function addTodoList(title: string) {
        const action = AddTodolistAC(title);
        dispatch(action);

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
                            let tasksForTodoList = tasks[tl.id];
                            if (tl.filter === 'Completed') {
                                tasksForTodoList = tasksForTodoList.filter(t => t.isDone);
                            }
                            if (tl.filter === 'Active') {
                                tasksForTodoList = tasksForTodoList.filter(t => !t.isDone);
                            }
                            return <Grid key={tl.id} item>
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

export default AppWithRedux;
