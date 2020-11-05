import React, {ChangeEvent, useState} from 'react';
import {TextField} from '@material-ui/core';
import {RequestStatusType} from '../../app/ app-reducer';


type EditableSpanType = {
    title: string
    changeTitle: (title: string) => void
    entityStatus:RequestStatusType
}

export const EditableSpan = React.memo((props: EditableSpanType) => {

    let [editMode, setEditMode] = useState(false)
    let [title, setTitle] = useState(props.title);


    const activatedEditMode = () => {
        if(props.entityStatus !== 'loading'){
            setEditMode(true)
            setTitle(props.title)
        }
    }

    const disActivatedEditMode = () => {
        setEditMode(false)
        props.changeTitle(title)
    }
    const onChangeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    return (
        editMode
            ?
            <TextField variant='outlined'
                       autoFocus
                       type="text"
                       value={title}
                       onBlur={disActivatedEditMode}
                       onChange={onChangeInputHandler}
            />
            :
            <span
                onDoubleClick={activatedEditMode}
            >{props.title}
            </span>

    )
})