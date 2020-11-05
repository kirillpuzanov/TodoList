import {setAppErrorAC, SetAppErrorACType, setAppStatusAC, SetAppStatusACType} from '../app/ app-reducer';
import {ThunkAction} from 'redux-thunk';
import {AppRootStateType} from './Store';
import {authApi, LoginParamsType} from '../api/todolist-api';
import {handleServerError} from '../utils/error-utils';


const initialState = {
    isLoggedIn: false
}
export const authReducer = (state: InitialStateType = initialState, action: ActionsType) => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN': {
            return {
                ...state,
                isLoggedIn: action.value
            }
        }

        default:
            return state
    }
}
//actions
export const setIsLoggedInAC = (value: boolean) => {
    return ({type: 'login/SET-IS-LOGGED-IN', value} as const)
}

//thunk
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>
export const loginTC = (data: LoginParamsType): ThunkType =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        authApi.login(data)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(setIsLoggedInAC(true))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerError(res.data, dispatch)
                }
            })
            .catch((err) => {
                dispatch(setAppErrorAC(err.message))
                dispatch(setAppStatusAC('failed'))
            })
    }

export const logoutTC = ():ThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authApi.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerError(res.data, dispatch)
            }
        })
        .catch((err) => {
            dispatch(setAppErrorAC(err.message))
            dispatch(setAppStatusAC('failed'))
        })
}


type InitialStateType = typeof initialState;
export type SetIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>
type ActionsType =
    | SetIsLoggedInACType
    | SetAppStatusACType
    | SetAppErrorACType;

