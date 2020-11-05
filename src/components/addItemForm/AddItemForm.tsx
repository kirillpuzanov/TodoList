import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {Button, TextField} from "@material-ui/core";
import {RequestStatusType} from '../../app/ app-reducer';


type AddItemFormType = {
    addItem: (title: string) => void
    entityStatus: RequestStatusType
}

export const AddItemForm = React.memo ((props: AddItemFormType)=> {

    let [newItemName, setNewItemName] = useState('');
    let [error, setError] = useState<string | null>(null);

    const onItemNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setNewItemName(e.currentTarget.value);
        setError(null);
    }

    const addKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(error !== null){
            setError(null);
        }
        if (e.charCode === 13) {
            addItemName();
            setNewItemName('');
        }
    }
    const addItemName = () => {
        if (newItemName.trim() !== '') {
            props.addItem(newItemName.trim());
            setNewItemName('');
        } else {
            setError('Title is required!');
        }
    }
    return (
        <div>
            <TextField variant='outlined' value={newItemName}
                       onChange={onItemNameChanged}
                       onKeyPress={addKeyPressHandler}
                       error={!!error}
                       label={'Title'}
                       helperText={error}
                       disabled={props.entityStatus === 'loading'}
            />
            <Button variant="contained"
                    color="primary"
                    onClick={addItemName}
                    disabled={props.entityStatus === 'loading'}
            >
                +
            </Button>
        </div>
    )
})