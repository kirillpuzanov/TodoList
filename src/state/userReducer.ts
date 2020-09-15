import React from 'react';

type UserStateType = {
    age: number
    childrenCount: number
    name: string
}

type ActionType = {
    type: string
    [key: string]: any
}

export const userReducer = (state: UserStateType, action: ActionType) => {
    switch (action.type) {
        case 'INCREMENT-AGE':
            return{
                ...state,
                age: state.age +1
            }
            // state.age = state.age + 1;
            // return state;
        case 'INCREMENT-CHILDREN-COUNT':
            return {
                ...state,
                childrenCount: state.childrenCount +1
            }
            // state.childrenCount = state.childrenCount +1;
            // return state;
        case 'CHANGE-NAME':
            return{
                ...state,
                name: state.name = action.newName
            }
        default:
            throw new Error("I don't understand action type!")
    }
}