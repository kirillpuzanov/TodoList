import {createAction} from '@reduxjs/toolkit'
import {RequestStatusType} from '../app/ app-reducer';



const setAppStatusAC = createAction<{status: RequestStatusType}>('appActions/setAppStatus')
const setAppErrorAC = createAction<{error: string | null}>('appActions/setAppError')

export const appActions = {
    setAppErrorAC,
    setAppStatusAC
}
