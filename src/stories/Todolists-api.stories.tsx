import React, {useEffect, useState} from 'react'
import {todolistApi} from "../api/todolist-api";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
       todolistApi.getTodolists()
            .then((response) => {
                setState(response.data)
            })

    }, [])
    return <div> {JSON.stringify(state)}</div>
}


export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistApi.createTodolist( '22222222')
            .then((response) => {
                debugger
                setState(response.data)
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}


export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'ce25fba5-ad9b-4fdc-b79e-61d756ed2aee'
        todolistApi.deleteTodolist(todolistId)
            .then((response) => {
                setState(response.data)
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '4df19a7b-71f8-46bc-87df-83dc0a063713'
        todolistApi.updateTodolist(todolistId, '333')
            .then((response) => setState(response.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const getTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '4e65da47-1f80-43cd-bb70-6e32314abfe9'
        todolistApi.getTasks(todolistId)
            .then((response) => setState(response.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const createTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '4e65da47-1f80-43cd-bb70-6e32314abfe9'
        const taskTile = 'AXIOS 2 lesson'
        todolistApi.createTask(todolistId,taskTile)
            .then((response) => setState(response.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const updateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '4e65da47-1f80-43cd-bb70-6e32314abfe9';
        const taskId = 'bb3b4f8e-63ce-4b7e-a970-436c93bebb8f';
        const modelTask = {
            title: 'MODEL TASK',
            description: 'first model',
            status: 0,
            priority: 1,
            startDate: new Date().toDateString(),
            deadline: '2021-10-10'
        }
        todolistApi.updateTask(todolistId,taskId,modelTask)
            .then((response) => setState(response.data))
    }, [])

    return <div> {JSON.stringify(state)}</div>
}


export const deleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '4e65da47-1f80-43cd-bb70-6e32314abfe9';
        const taskId = 'd1c82284-2b07-4e00-a676-0a7f14e613a2';
        todolistApi.deleteTask(todolistId, taskId)
            .then((response) => {
                setState(response.data)
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}