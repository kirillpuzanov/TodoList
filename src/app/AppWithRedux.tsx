import React, {useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {TodolistsList} from '../features/todolistsList/TodolistsList';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../state/Store';
import {initializeAppTC, RequestStatusType} from './ app-reducer';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar';
import {Route, Redirect, Switch} from 'react-router-dom';
import {Login} from '../features/login/Login';
import {logoutTC} from '../state/authReducer';


function AppWithRedux() {
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const logoutHandler = () => {
        dispatch(logoutTC())
    }


    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button onClick={logoutHandler} color="inherit">Log out</Button>}
                </Toolbar>
            </AppBar>
            {status === 'loading' && <LinearProgress color="secondary"/>}
            <Container fixed>
                <Switch>
                    <Route exact path={'/'} render={() => <TodolistsList/>}/>
                    <Route path={'/login'} render={() => <Login/>}/>
                    <Route path={'/404'} render={() => <h1>404: PAGE NOT FOUND</h1>}/>
                    <Redirect from={'*'} to={'/404'}/>
                </Switch>
            </Container>
        </div>
    );
}

export default AppWithRedux;


