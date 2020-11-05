import {setAppErrorAC, SetAppErrorACType, setAppStatusAC, SetAppStatusACType} from '../app/ app-reducer';
import {ResponseType} from '../api/todolist-api';
import {Dispatch} from 'redux';


export const handleServerError = <T>(data: ResponseType<T>, dispatch: Dispatch<ActionType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

type ActionType = SetAppStatusACType | SetAppErrorACType



