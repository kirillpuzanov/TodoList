import React, {useCallback} from "react";
import {FilterValuesType} from "./App";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task";


type TodoListPropsType = {
    title: string,
    tasks: Array<taskType>
    removeTask: (id: string, todoListId: string) => void
    changeFilter: (todoListId: string, value: FilterValuesType) => void
    addTask: (title: string, todoListId: string) => void
    changeStatus: (id: string, isDone: boolean, todoListId: string) => void
    filter: FilterValuesType
    id: string
    removeTodoList: (todoListId: string) => void
    changeTaskTitle: (id: string, newTitle: string, todoListId: string) => void
    changeTodoListTitle: (todoListId: string, newTitle: string) => void

}
export type taskType = {
    id: string
    title: string
    isDone: boolean
}

export const TodoList = React.memo((props: TodoListPropsType) => {
    console.log('TodoList')
    const onAllClickHandler = useCallback(() => props.changeFilter(props.id, 'All'), [props.changeFilter, props.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.id, 'Active'), [props.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.id, 'Completed'), [props.id, props.changeFilter])

    const removeTodoList = () => props.removeTodoList(props.id);

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.id, props.addTask]);

    const changeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodoListTitle(props.id, newTitle)
    }, [props.id, props.changeTodoListTitle]);


    let tasksForTodoList = props.tasks;
    if (props.filter === 'Completed') {
        tasksForTodoList = props.tasks.filter(t => t.isDone);
    }
    if (props.filter === 'Active') {
        tasksForTodoList = props.tasks.filter(t => !t.isDone);
    }


    return (
        <div>
            <h3><EditableSpan title={props.title}
                              changeTitle={changeTodoListTitle}
            />
                <IconButton aria-label="delete" onClick={removeTodoList}>
                    <Delete/>
                </IconButton>
            </h3>

            <AddItemForm
                addItem={addTask}/>
            <ul>
                {
                    tasksForTodoList.map(t => <Task
                        key={t.id}
                        task={t}
                        todooListId={props.id}
                        removeTask={props.removeTask}
                        changeStatus={props.changeStatus}
                        changeTaskTitle={props.changeTaskTitle}

                    />)
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
})

