import {AppRootStateType} from '../state/Store';


export const selectStatus = (state:AppRootStateType)=> state.app.status;
export const selectIsInitialized = (state:AppRootStateType)=> state.app.isInitialized;