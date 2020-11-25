import {setAppErrorAC, SetAppErrorACType, setAppStatusAC, SetAppStatusACType} from '../app/ app-reducer';
import {ThunkAction} from 'redux-thunk';
import {AppRootStateType} from './Store';
import {authApi, LoginParamsType} from '../api/todolist-api';
import {handleServerError} from '../utils/error-utils';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        }
    },
})

export const authReducer = slice.reducer;

export const {setIsLoggedInAC} = slice.actions;

//thunk
type ThunkType = ThunkAction<void, AppRootStateType, unknown, any>
export const loginTC = (data: LoginParamsType): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatusAC({status:'loading'}))
        authApi.login(data)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(setIsLoggedInAC({value: true}))
                    dispatch(setAppStatusAC({status:'succeeded'}))
                } else {
                    handleServerError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
                dispatch(setAppStatusAC({status:'failed'}))
            })
    }

export const logoutTC = (): ThunkType => (dispatch) => {
    dispatch(setAppStatusAC({status:'loading'}))
    authApi.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({status:'succeeded'}))
            } else {
                handleServerError(res.data, dispatch)
            }
        })
        .catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC({status:'failed'}))
        })
}



export type SetIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>
type ActionsType =
    | SetIsLoggedInACType
    | SetAppStatusACType
    | SetAppErrorACType;

