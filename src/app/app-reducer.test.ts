import {appReducer, InitialStateType} from './ app-reducer';
import {appActions} from '../commonAcnions/appActions';


let startState: InitialStateType
beforeEach(() => {
    startState = {
        error: '',
        status: 'idle',
        isInitialized: false
    }
})

test('correct status should be set', () => {

    const endState = appReducer(startState, appActions.setAppStatusAC({status: 'loading'}))
    expect(endState.status).toBe('loading');
});

test('correct errorMessage should be set', () => {

    const endState = appReducer(startState, appActions.setAppErrorAC({error: 'some error'}))
    expect(endState.error).toBe('some error');

});