import {ThunkAction} from 'redux-thunk';
import {AppRootStateType} from '../state/Store';
import {authApi} from '../api/todolist-api';
import {setIsLoggedInAC, SetIsLoggedInACType} from '../state/authReducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false,
}

const slice = createSlice({
    name:'app',
    initialState:initialState,
    reducers:{
        setAppStatusAC(state,action:PayloadAction<{status: RequestStatusType}>){
            state.status = action.payload.status;
        },
        setAppErrorAC(state,action:PayloadAction<{error: string | null}>){
            state.error = action.payload.error;
        },
        setInitializingAppAC(state,action:PayloadAction<{isInitialized: boolean}>){
            state.isInitialized = action.payload.isInitialized;
        }
    }
})

export const appReducer = slice.reducer;
export const {setAppStatusAC,setAppErrorAC,setInitializingAppAC} = slice.actions;

//thunk
type ThunkType = ThunkAction<void, AppRootStateType, unknown, any>
export const initializeAppTC = (): ThunkType => (dispatch) => {
    authApi.me().then(res => {
        dispatch(setInitializingAppAC({isInitialized:true}))
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
        } else {
        }
    })
}


export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    //status - происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}

export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export type SetInitializingAppACType = ReturnType<typeof setInitializingAppAC>
export type ActionsType =
    | SetAppStatusACType
    | SetAppErrorACType
    | SetInitializingAppACType


