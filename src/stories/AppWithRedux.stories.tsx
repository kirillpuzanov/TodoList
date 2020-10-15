
import AppWithRedux from "../AppWithRedux";
import React from "react";
import {ReduxStoreProviderDecorator} from "./ReduxStoreProviderDecorator";



export default {
    title: 'AppWithRedux stories',
    component: AppWithRedux,
    decorators:[ReduxStoreProviderDecorator]
};


export const AppWithReduxBaseExample = (props: any) => {
    return (
            <AppWithRedux/>
    )
};
