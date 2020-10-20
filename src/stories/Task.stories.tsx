import React from 'react';
import {action} from '@storybook/addon-actions';
import {Task} from "../Task";
import {TaskStatuses, TodoTaskPriorities} from "../api/todolist-api";


export default {
    title: 'Task Stories',
    component: Task,
};
const changeTaskTitleCallback = action('Change title inside task');
const changeStatusCallback = action('Status changet inside task ');
const removeTaskCallback = action('Remove task ');


export const TaskBaseExample = (props: any) => {
    return (
        <div>
            <Task
                task={{
                    id: '1', status: TaskStatuses.Completed,
                    priority: TodoTaskPriorities.Low,
                    startDate: '',
                    deadline: '',
                    todoListId: 'todoListId1',
                    order: 0,
                    addedDate: '',
                    description: '', title: 'CSS'
                }}
                todoListId={'todolistId1'}
                removeTask={removeTaskCallback}
                changeStatus={changeStatusCallback}
                changeTaskTitle={changeTaskTitleCallback}
            />
            <Task
                task={{
                    id: '2', status: TaskStatuses.Completed,
                    priority: TodoTaskPriorities.Low,
                    startDate: '',
                    deadline: '',
                    todoListId: 'todoListId1',
                    order: 0,
                    addedDate: '',
                    description: '', title: 'HTML'
                }}
                todoListId={'todolistId2'}
                removeTask={removeTaskCallback}
                changeStatus={changeStatusCallback}
                changeTaskTitle={changeTaskTitleCallback}
            />
        </div>
    )
};
