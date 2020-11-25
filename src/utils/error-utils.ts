import {setAppErrorAC, SetAppErrorACType, setAppStatusAC, SetAppStatusACType} from '../app/ app-reducer';
import {ResponseType} from '../api/todolist-api';
import {Dispatch} from 'redux';


export const handleServerError = <T>(data: ResponseType<T>, dispatch: Dispatch<ActionType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error:data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error:'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status:'failed'}))
}

type ActionType = SetAppStatusACType | SetAppErrorACType



