import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../components/editableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../../../api/todolist-api";
import {RequestStatusType} from '../../../../app/ app-reducer';


type TaskPropsType = {
    changeTaskTitle: (id: string, newTitle: string, todoListId: string) => void
    changeStatus: (id: string, status: TaskStatuses, todoListId: string) => void
    removeTask: (id: string, todoListId: string) => void
    task: TaskType
    todoListId: string
    entityStatus:RequestStatusType
}
export const Task = React.memo((props: TaskPropsType) => {

    const {changeTaskTitle,changeStatus,removeTask,task,todoListId} = props;

    const onRemoveHandler = useCallback(() => removeTask(task.id, todoListId), [removeTask, task.id, todoListId]);
    const onChangeStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        changeStatus(task.id,
            e.currentTarget.checked
            ? TaskStatuses.Completed
            : TaskStatuses.New, todoListId)
    }, [task.id, todoListId]);

    const onchangeTaskTitle = useCallback((newTitle: string) => {
        changeTaskTitle(task.id, newTitle, todoListId)
    }, [task.id, todoListId])

    return (
        <li key={task.id}
            className={task.status === TaskStatuses.Completed ? 'is-done' : ''}
        >
            <Checkbox
                color={"primary"}
                checked={task.status === TaskStatuses.Completed}
                onChange={onChangeStatus}

            />
            <EditableSpan
                title={task.title}
                changeTitle={onchangeTaskTitle}
                entityStatus={props.entityStatus}
            />
            <IconButton aria-label="delete" onClick={onRemoveHandler}>
                <Delete/>
            </IconButton>
        </li>
    )
})