import React from 'react';
import {action} from '@storybook/addon-actions';

import {EditableSpan} from "./EditableSpan";
import {Task} from '../../features/todolistsList/todolist/task/Task';


export default {
    title: 'EditableSpan stories',
    component: EditableSpan,
};


export const EditableSpanBaseExample = (props: any) => {
    return (
        <EditableSpan
            changeTitle={action('value changed')}
            title={'Start value'}
            entityStatus={'idle'}
        />
    )
};
