import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './trash/App';
import * as serviceWorker from './serviceWorker';
import AppWithReducers from "./trash/AppWithReducers";
import {Provider} from "react-redux";
import {store} from "./state/Store";
import AppWithRedux from "./app/AppWithRedux";

ReactDOM.render(
    <Provider store={store}>
    <AppWithRedux />
    </Provider>
    ,  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
