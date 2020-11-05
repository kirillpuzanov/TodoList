import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../../state/Store';
import {
    changeFilterTodolistAC,
    changeTitleTodolistTC,
    createTodolistTC,
    FilterValuesType,
    getTodolistsTC,
    removeTodolistTC,
    TodolistDomainType
} from '../../state/todolists-reducer';
import React, {useCallback, useEffect} from 'react';
import {
    addTaskTC,
    changeTaskTitleTC,
    removeTaskTC,
    TasksStateType,
    updateTaskStatusTC
} from '../../state/tasks-reducer';
import {TaskStatuses} from '../../api/todolist-api';
import {Grid, Paper} from '@material-ui/core';
import {AddItemForm} from '../../components/addItemForm/AddItemForm';
import {TodoList} from './todolist/TodoList';



export const TodolistsList = () => {

    const dispatch = useDispatch();
    const todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists);
    const tasks = useSelector<AppRootStateType, TasksStateType>
    (state => state.tasks);

    useEffect(() => {
        dispatch(getTodolistsTC())
    }, [])

    const removeTask = useCallback((id: string, todoListId: string) => {
        dispatch(removeTaskTC(id, todoListId))

    }, [dispatch])

    const addTask = useCallback((title: string, todoListId: string) => {
        dispatch(addTaskTC(title, todoListId))
    }, [dispatch])


    const changeStatus = useCallback((id: string, status: TaskStatuses, todoListId: string) => {
        dispatch(updateTaskStatusTC(id, status, todoListId))
    }, [dispatch])


    const changeTaskTitle = useCallback((id: string, newTitle: string, todoListId: string) => {
        dispatch(changeTaskTitleTC(id, newTitle, todoListId))
    }, [dispatch])

//....................функции для тудулистов

    const changeFilter = useCallback((todoListId: string, value: FilterValuesType) => {
        const action = changeFilterTodolistAC(todoListId, value);
        dispatch(action);
    }, [dispatch])

    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodolistTC(todoListId))

    }, [dispatch])

    const changeTodoListTitle = useCallback((todoListId: string, newTitle: string) => {
        dispatch(changeTitleTodolistTC(todoListId, newTitle))
    }, [dispatch])

    const addTodoList = useCallback((title: string) => {
        dispatch(createTodolistTC(title));
    }, [dispatch])


    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodoList} entityStatus={'idle'}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todoLists.map((tl) => {
                    let tasksForTodoList = tasks[tl.id]
                    return <Grid key={tl.id} item>
                        <Paper style={{padding: '10px'}}>
                            <TodoList
                                key={tl.id}
                                todolist={tl}
                                tasks={tasksForTodoList}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeStatus={changeStatus}
                                removeTodoList={removeTodoList}
                                changeTaskTitle={changeTaskTitle}
                                changeTodoListTitle={changeTodoListTitle}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}