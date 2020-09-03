import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {Button, TextField} from "@material-ui/core";


type AddItemFormType = {
    addItem: (title: string) => void
}

export function AddItemForm(props: AddItemFormType) {

    let [newItemName, setNewItemName] = useState('');
    let [error, setError] = useState<string | null>(null);

    const onItemNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        setNewItemName(e.currentTarget.value);
        setError(null);
    }

    const addKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
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
                // className={error ? 'error' : ''}
                       error={!!error}
                       label={'Title'}
                       helperText={error}
            />
            {/*<button onClick={addItemName}>+</button>*/}
            <Button variant="contained"
                    color="primary"
                    onClick={addItemName}>
                +
            </Button>
        </div>
    )
}