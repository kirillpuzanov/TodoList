import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/addItemForm/AddItemForm';
import {EditableSpan} from '../../../components/editableSpan/EditableSpan';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import {Task} from './task/Task';
import {TaskStatuses} from '../../../api/todolist-api';
import {FilterValuesType, TodolistDomainType} from '../../../state/todolists-reducer';
import {useDispatch} from 'react-redux';
import {getTasks, TaskDomainType} from '../../../state/tasks-reducer';


type TodoListPropsType = {
    todolist:TodolistDomainType
    tasks: Array<TaskDomainType>
    removeTask: (id: string, todoListId: string) => void
    changeFilter: (todoListId: string, value: FilterValuesType) => void
    addTask: (title: string, todoListId: string) => void
    changeStatus: (id: string, status: TaskStatuses, todoListId: string) => void
    removeTodoList: (todoListId: string) => void
    changeTaskTitle: (id: string, newTitle: string, todoListId: string) => void
    changeTodoListTitle: (todoListId: string, newTitle: string) => void
}

export const TodoList = React.memo((props: TodoListPropsType) => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTasks(props.todolist.id))
    }, [])

    const onAllClickHandler = useCallback(() => props.changeFilter(props.todolist.id, 'All')
        , [props.changeFilter, props.todolist.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.todolist.id, 'Active')
        , [props.todolist.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.todolist.id, 'Completed')
        , [props.todolist.id, props.changeFilter])

    const removeTodoList = () => props.removeTodoList(props.todolist.id);

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.todolist.id)
    }, [props.todolist.id, props.addTask]);

    const changeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodoListTitle(props.todolist.id, newTitle)
    }, [props.todolist.id, props.changeTodoListTitle]);


    let tasksForTodoList = props.tasks;
    if (props.todolist.filter === 'Completed') {
        tasksForTodoList = props.tasks.filter(t => t.status === TaskStatuses.Completed);
    }
    if (props.todolist.filter === 'Active') {
        tasksForTodoList = props.tasks.filter(t => t.status === TaskStatuses.New);
    }


    return (
        <div>
            <h3><EditableSpan title={props.todolist.title}
                              changeTitle={changeTodoListTitle}
                              entityStatus={props.todolist.entityStatus}
            />
                <IconButton aria-label="delete"
                            onClick={removeTodoList}
                            disabled={props.todolist.entityStatus === 'loading'}
                >
                    <Delete/>
                </IconButton>
            </h3>

            <AddItemForm
                addItem={addTask}
                entityStatus={props.todolist.entityStatus}
            />
            <ul>
                {
                    tasksForTodoList.map(t => <Task
                        key={t.id}
                        task={t}
                        todoListId={props.todolist.id}
                        removeTask={props.removeTask}
                        changeStatus={props.changeStatus}
                        changeTaskTitle={props.changeTaskTitle}
                        entityStatus={props.todolist.entityStatus}
                    />)
                }
            </ul>
            <div>
                <Button
                    variant={props.todolist.filter === 'All' ? 'outlined' : 'text'}
                    color="primary"
                    onClick={onAllClickHandler}> All
                </Button>
                <Button
                    variant={props.todolist.filter === 'Active' ? 'outlined' : 'text'}
                    color="primary"
                    onClick={onActiveClickHandler}>Active
                </Button>
                <Button
                    variant={props.todolist.filter === 'Completed' ? 'outlined' : 'text'}
                    color="primary"
                    onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    )
})

