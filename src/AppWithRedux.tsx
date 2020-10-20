import React, {useCallback} from 'react';
import './App.css';
import { TodoList} from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, IconButton, Typography, Toolbar, Container, Grid, Paper} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodolistAC,
    ChangeFilterTodolistAC,
    ChangeTitleTodolistAC, FilterValuesType,
    RemoveTodolistAC, TodolistDomainType,
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/Store";
import {TaskStatuses, TaskType} from "./api/todolist-api";



export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function AppWithRedux() {
    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists);
    const tasks = useSelector<AppRootStateType, TasksStateType>
    (state => state.tasks);

    const  removeTask = useCallback ((id: string, todoListId: string)=> {
        const action = removeTaskAC(id, todoListId);
        dispatch(action);
    },[dispatch])

    const  addTask = useCallback((title: string, todoListId: string)=> {
        const action = addTaskAC(title, todoListId);
        dispatch(action);
    },[dispatch])


    const  changeStatus = useCallback ((id: string, status: TaskStatuses, todoListId: string)=> {
        const action = changeTaskStatusAC(id, status, todoListId);
        dispatch(action);
    },[dispatch])


    const  changeTaskTitle = useCallback((id: string, newTitle: string, todoListId: string)=> {
        const action = changeTaskTitleAC(id, newTitle, todoListId);
        dispatch(action);
    },[dispatch])

    //....................функции для тудулистов

    const  changeFilter = useCallback ((todoListId: string, value: FilterValuesType)=> {
        const action = ChangeFilterTodolistAC(todoListId, value);
        dispatch(action);
    },[dispatch])

    const  removeTodoList = useCallback((todoListId: string)=> {
        const action = RemoveTodolistAC(todoListId);
        dispatch(action);
    },[dispatch])

    const  changeTodoListTitle = useCallback((todoListId: string, newTitle: string)=> {
        const action = ChangeTitleTodolistAC(todoListId, newTitle);
        dispatch(action);
    },[dispatch])

    const addTodoList = useCallback((title: string) => {
        const action = AddTodolistAC(title);
        dispatch(action);
    },[dispatch])

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
                            let tasksForTodoList = tasks[tl.id]
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
