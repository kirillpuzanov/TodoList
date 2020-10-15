import React from 'react';
import {action} from '@storybook/addon-actions';
import {Task} from "../Task";


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
                task={{id: '1', isDone: true, title: 'CSS'}}
                todoListId={'todolistId1'}
                removeTask={removeTaskCallback}
                changeStatus={changeStatusCallback}
                changeTaskTitle={changeTaskTitleCallback}
            />
            <Task
                task={{id: '2', isDone: false, title: 'HTML'}}
                todoListId={'todolistId2'}
                removeTask={removeTaskCallback}
                changeStatus={changeStatusCallback}
                changeTaskTitle={changeTaskTitleCallback}
            />
        </div>
    )
};
