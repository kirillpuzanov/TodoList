import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {taskType} from "./TodoList";

type TaskPropsType = {
    changeTaskTitle: (id: string, newTitle: string, todoListId: string) => void
    changeStatus: (id: string, isDone: boolean, todoListId: string) => void
    removeTask: (id: string, todoListId: string) => void
    task: taskType
    todooListId: string
}
export const Task = React.memo((props: TaskPropsType) => {

    const onRemoveHandler = useCallback(() => props.removeTask(props.task.id, props.todooListId),[props.removeTask, props.task.id, props.todooListId]);
    const onChangeStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        props.changeStatus(props.task.id, e.currentTarget.checked, props.todooListId)
    },[]);
    const changeTaskTitle = useCallback((newTitle: string) => {
        props.changeTaskTitle(props.task.id, newTitle, props.todooListId)
    },[props.task.id, props.todooListId])
    return (
        <li key={props.task.id}
            className={props.task.isDone ? 'is-done' : ''}
        >
            <Checkbox
                color={"primary"}
                checked={props.task.isDone}
                onChange={onChangeStatus}
            />
            <EditableSpan
                title={props.task.title}
                changeTitle={changeTaskTitle}
            />
            <IconButton aria-label="delete" onClick={onRemoveHandler}>
                <Delete/>
            </IconButton>
        </li>
    )
})