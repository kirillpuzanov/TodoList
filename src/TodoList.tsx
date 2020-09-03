import React, {ChangeEvent} from "react";
import {FilterValuesType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";


type TodoListPropsType = {
    title: string,
    tasks: Array<TasksType>
    removeTask: (id: string, todoListId: string) => void
    changeFilter: (value: FilterValuesType, todoListId: string) => void
    addTask: (title: string, todoListId: string) => void
    changeStatus: (id: string, isDone: boolean, todoListId: string) => void
    filter: FilterValuesType
    id: string
    removeTodoList: (todoListId: string) => void
    changeTaskTitle: (id: string, newTitle: string, todoListId: string) => void
    changeTodoListTitle: (newTitle: string, todoListId: string) => void

}
export type TasksType = {
    id: string
    title: string
    isDone: boolean
}

export function TodoList(props: TodoListPropsType) {

    const onAllClickHandler = () => props.changeFilter('All', props.id)
    const onActiveClickHandler = () => props.changeFilter('Active', props.id)
    const onCompletedClickHandler = () => props.changeFilter('Completed', props.id)
    const removeTodoList = () => props.removeTodoList(props.id)
// функция по добавлению id  в функцию из самой компоненты AddItemForm
    const addTask = (title: string) => {
        props.addTask(title, props.id)
    }
    const changeTodoListTitle = (newTitle: string) => {
        props.changeTodoListTitle(newTitle, props.id)
    }
    return (
        <div>
            <h3><EditableSpan title={props.title}
                              changeTitle={changeTodoListTitle}
            />
                {/*<button onClick={removeTodoList}>del</button>*/}
                <IconButton aria-label="delete" onClick={removeTodoList}>
                    <Delete/>
                </IconButton>
            </h3>

            <AddItemForm
                addItem={addTask}/>
            <ul>
                {
                    props.tasks.map((t) => {
                        const onRemoveHandler = () => props.removeTask(t.id, props.id);
                        const onChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
                            props.changeStatus(t.id, e.currentTarget.checked, props.id)
                        };
                        const changeTaskTitle = (newTitle: string) => {
                            props.changeTaskTitle(t.id, newTitle, props.id)
                        }
                        return (
                            <li key={t.id}
                                className={t.isDone ? 'is-done' : ''}
                            >
                                <Checkbox
                                    color={"primary"}
                                    checked={t.isDone}
                                    onChange={onChangeStatus}
                                />
                                <EditableSpan
                                    title={t.title}
                                    changeTitle={changeTaskTitle}
                                />
                                {/*<button onClick={onRemoveHandler}>x</button>*/}
                                <IconButton aria-label="delete" onClick={onRemoveHandler}>
                                    <Delete/>
                                </IconButton>
                            </li>
                        )
                    })
                }
            </ul>
            <div>
                <Button
                        variant={props.filter === 'All' ? "outlined" : 'text'}
                        color="primary"
                        onClick={onAllClickHandler}> All
                </Button>
                <Button
                        variant={props.filter === 'Active' ? "outlined" : 'text'}
                        color="primary"
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button
                        variant={props.filter === 'Completed' ? "outlined" : 'text'}
                        color="primary"
                        onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    )
}
