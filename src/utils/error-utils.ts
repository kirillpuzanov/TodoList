import {ResponseType} from '../api/todolist-api';
import {AxiosError} from 'axios';
import {appActions} from '../commonAcnions/appActions';


export const handleServerAppError = <D>(data: ResponseType<D>, thunkAPI: ThunkAPIType, showError = true) => {
    if (showError) {
        thunkAPI.dispatch(appActions.setAppErrorAC({
            error: data.messages.length
                ? data.messages[0]
                : 'Some error occurred'
        }))
    }
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'failed'}))
    return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})
}

export const handleServerNetworkError = (error: AxiosError, thunkAPI: ThunkAPIType, showError = true) => {
    if (showError) {
        thunkAPI.dispatch(appActions.setAppErrorAC({
            error: error.message
                ? error.message
                : 'Some error occurred'
        }))
    }
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'failed'}))
    return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
}

// original type:
// BaseThunkAPI<S, E, D extends Dispatch = Dispatch, RejectedValue = undefined>
type ThunkAPIType = {
    dispatch: (action: any) => any
    rejectWithValue: Function
}


