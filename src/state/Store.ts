import {combineReducers} from 'redux';
import {tasksReducer} from './tasks-reducer';
import {todoListsReducer} from './todolists-reducer';
import thunk from 'redux-thunk';
import {appReducer} from '../app/ app-reducer';
import {authReducer} from './authReducer';
import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {FieldErrorType} from '../api/todolist-api';


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListsReducer,
    app: appReducer,
    auth: authReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})


export type AppRootStateType = ReturnType<typeof rootReducer>;

// @ts-ignore
window.store = store;

type AppDispatchType = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatchType>();
export type ThunkError = { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> } }
