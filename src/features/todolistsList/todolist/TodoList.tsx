import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/addItemForm/AddItemForm";
import {EditableSpan} from "../../../components/editableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {FilterValuesType} from "../../../state/todolists-reducer";
import {useDispatch} from "react-redux";
import {getTasksTC} from "../../../state/tasks-reducer";


type TodoListPropsType = {
    title: string,
    tasks: Array<TaskType>
    removeTask: (id: string, todoListId: string) => void
    changeFilter: (todoListId: string, value: FilterValuesType) => void
    addTask: (title: string, todoListId: string) => void
    changeStatus: (id: string, status: TaskStatuses, todoListId: string) => void
    filter: FilterValuesType
    id: string
    removeTodoList: (todoListId: string) => void
    changeTaskTitle: (id: string, newTitle: string, todoListId: string) => void
    changeTodoListTitle: (todoListId: string, newTitle: string) => void

}

export const TodoList = React.memo((props: TodoListPropsType) => {

    const dispatch = useDispatch();
    useEffect( ()=> {
        dispatch(getTasksTC( props.id))
    },[])

    const onAllClickHandler = useCallback(() => props.changeFilter(props.id, 'All')
        , [props.changeFilter, props.id])
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.id, 'Active')
        , [props.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.id, 'Completed')
        , [props.id, props.changeFilter])

    const removeTodoList = () => props.removeTodoList(props.id);

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    }, [props.id, props.addTask]);

    const changeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodoListTitle(props.id, newTitle)
    }, [props.id, props.changeTodoListTitle]);


    let tasksForTodoList = props.tasks;
    if (props.filter === 'Completed') {
        tasksForTodoList = props.tasks.filter(t => t.status === TaskStatuses.Completed);
    }
    if (props.filter === 'Active') {
        tasksForTodoList = props.tasks.filter(t => t.status === TaskStatuses.New );
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
                        todoListId={props.id}
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

