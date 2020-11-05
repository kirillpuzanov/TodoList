

export const setAppStatusAC = (status: RequestStatusType) => {
    return ({type: 'APP/SET-STATUS', status} as const)
}
export const setAppErrorAC = (error: string | null) => {
    return ({type: 'APP/SET-ERROR', error}as const)
}


export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':{
            return {...state, error:action.error}
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
}
 const initialState: InitialStateType = {
    status: 'idle',
    error: null,
}
export type SetAppStatusACType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorACType = ReturnType<typeof setAppErrorAC>
export type ActionsType =
    | SetAppStatusACType
    | SetAppErrorACType


