import {authApi} from '../api/todolist-api';
import {setIsLoggedInAC} from '../state/authReducer';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {appActions} from '../commonAcnions/appActions';


export const initializeAppTC = createAsyncThunk('app/initializeApp', async (param, {dispatch}) => {
    const res = await authApi.me()
    if (res.data.resultCode === 0){
        dispatch(setIsLoggedInAC({value: true}));
    }else {
    }
})


const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle',
        error: null,
        isInitialized: false,
    } as InitialStateType,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(initializeAppTC.fulfilled, (state) => {
            state.isInitialized = true;
        })
        builder.addCase(appActions.setAppStatusAC, (state, action) => {
            state.status = action.payload.status
        })
        builder.addCase(appActions.setAppErrorAC, (state, action) => {
            state.error = action.payload.error
        })
    }
})

export const appReducer = slice.reducer;

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    //status - происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    // true когда приложение проинициализировалось (проверили юзера, настройки получили и т.д.)
    isInitialized: boolean
}



