import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': 'aee1e098-c1ec-45af-b764-0edfc4a89fa8'
    }
})
//api

export const authApi = {
    me() {
        return instance.get<{ data: authDataType, resultCode: number, messages: string[] }>('auth/me')
    },
    login(data: LoginParamsType) {
        return instance.post<ResponseType<{ userId: number }>>('auth/login', data)
    },
    logout() {
        return instance.delete<ResponseType>('auth/login')
    }

}

export const todolistApi = {

    //todolists
    getTodolists() {
        return instance.get<Array<TodolistType>>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title})
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },


    //tasks
    getTasks(todolistId: string) {
        return instance.get<TasksResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(taskTitle: string, todolistId: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title: taskTitle})
    },
    updateTask(taskId: string, model: modelTaskType, todolistId: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    },
    deleteTask(taskId: string, todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    }
}

// types
export type authDataType = {
    id: null | number
    email: null | string
    login: null | string
}
export type LoginParamsType = {
    email: string
    password: string
    rememberMe: boolean
    captcha?: string
}

export type TodolistType = {
    id: string
    addedDate: string
    order: number
    title: string
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses | string
    priority: TodoTaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type modelTaskType = {
    title: string
    description: string
    status: TaskStatuses | string
    priority: number
    startDate: string
    deadline: string
}

export type FieldErrorType = { field: string, error: string };
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors?: Array<FieldErrorType>
    data: D
}
export type TasksResponseType = {
    items: Array<TaskType>
    totalCount: number
    error: null | string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TodoTaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
