import {applyMiddleware, combineReducers, createStore} from "redux";
import {tasksReducer} from "./tasks-reducer";
import {todoListsReducer} from "./todolists-reducer";
import thunk from "redux-thunk";
import {appReducer} from '../app/ app-reducer';
import {authReducer} from './authReducer';


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists:todoListsReducer,
    app:appReducer,
    auth: authReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>;

// @ts-ignore
window.store = store;