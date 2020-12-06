
import {authApi, FieldErrorType, LoginParamsType} from '../api/todolist-api';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {appActions} from '../commonAcnions/appActions';


//типизация createAsyncThunk <1 возвращаемое значение, 2 что приходит в санку(аргументы),
// 3 описываем ошибку  { rejectValue: наши ошибки}>

export const loginTC = createAsyncThunk<undefined,
    LoginParamsType, { rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] } }>
('auth/login', async (data, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}))
    try {
        const res = await authApi.login(data)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}))
            return
        } else {
            return handleServerAppError(res.data, thunkAPI)
        }
    } catch (err) {
        return handleServerNetworkError(err.message, thunkAPI)
    }
})

export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatusAC({status: 'loading'}))
    try {
        const res = await authApi.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatusAC({status: 'succeeded'}))
        } else handleServerAppError(res.data, thunkAPI)
    } catch (err) {
        return handleServerNetworkError(err.message, thunkAPI)
    }
})


const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value;
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = true;
        })
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            state.isLoggedIn = false;
        })
    }
})

export const authReducer = slice.reducer;
export const {setIsLoggedInAC} = slice.actions;



