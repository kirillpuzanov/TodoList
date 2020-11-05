import {ThunkAction} from 'redux-thunk';
import {AppRootStateType} from '../state/Store';
import {authApi} from '../api/todolist-api';
import {setIsLoggedInAC, SetIsLoggedInACType} from '../state/authReducer';


export const setAppStatusAC = (status: RequestStatusType) => {
    return ({type: 'APP/SET-STATUS', status} as const)
}
export const setAppErrorAC = (error: string | null) => {
    return ({type: 'APP/SET-ERROR', error} as const)
}
export const setInitializingAppAC = (isInitialized: boolean) => {
    return ({type: 'APP/INITIALIZING-APP', isInitialized} as const)
}

//thunk
type ThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>
export const initializeAppTC = (): ThunkType => (dispatch) => {
    authApi.me().then(res => {
        dispatch(setInitializingAppAC(true))
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC(true));
        } else {
        }
    })
}


export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR': {
            return {...state, error: action.error}
        }
        case 'APP/INITIALIZING-APP':{
            return {...state, isInitialized:action.isInitialized}
        }
        default:
            return state
    }
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    //status - происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false,
}
export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export type SetInitializingAppACType = ReturnType<typeof setInitializingAppAC>
export type ActionsType =
    | SetAppStatusACType
    | SetAppErrorACType
    | SetIsLoggedInACType
    | SetInitializingAppACType


