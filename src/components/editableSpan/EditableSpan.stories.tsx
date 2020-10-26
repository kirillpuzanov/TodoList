import React from 'react';
import {action} from '@storybook/addon-actions';

import {EditableSpan} from "./EditableSpan";


export default {
    title: 'EditableSpan stories',
    component: EditableSpan,
};


export const EditableSpanBaseExample = (props: any) => {
    return (
        <EditableSpan changeTitle={action('value changet')} title={'Start value'}/>
    )
};
