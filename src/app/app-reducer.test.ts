import {appReducer, InitialStateType, setAppErrorAC, setAppStatusAC} from './ app-reducer';


let startState: InitialStateType
beforeEach(() => {
    startState = {
        error: '',
        status: 'idle'
    }
})

test('correct status should be set', () => {

    const endState = appReducer(startState, setAppStatusAC('loading'))
    expect(endState.status).toBe('loading');
});

test('correct errorMessage should be set', () => {

    const endState = appReducer(startState, setAppErrorAC('some error'))
    expect(endState.error).toBe('some error');

});