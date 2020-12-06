import React from 'react';
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from '@material-ui/core'
import {FormikHelpers, useFormik} from 'formik';
import {useSelector} from 'react-redux';
import {loginTC} from '../../state/authReducer';
import {AppRootStateType, useAppDispatch} from '../../state/Store';
import {Redirect} from 'react-router-dom';

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}
type FormValueType = {
    email: string
    password: string
    rememberMe: boolean
}



export const Login = () => {

    const dispatch = useAppDispatch();
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn);


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        } as FormValueType,
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 3) {
                errors.password = 'short password';
            }
            return errors;
        },

        //реализация обработки и отбражения серверных ошибок для конкретного поля в форме
        onSubmit: async (values:FormValueType,formikHelpers:FormikHelpers<FormValueType>) => {
           const action = await dispatch(loginTC(values));
            if(loginTC.rejected.match(action)) {
                if(action.payload?.fieldsErrors?.length){
                    const error = action.payload?.fieldsErrors[0];
                    formikHelpers.setFieldError(error.field,error.error)
                }
            }
        },
    })

    if (isLoggedIn) {
        return <Redirect to={'/'}/>
    }

    return <Grid container justify="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}>here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}

                        />
                        {formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                        <TextField
                            type="password"
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                            {...formik.getFieldProps('rememberMe')}
                                checked={formik.values.rememberMe}
                            />}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
