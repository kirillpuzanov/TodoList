import axios from "axios";

const instance = axios.create({
    baseURL:'https://social-network.samuraijs.com/api/1.1/',
    withCredentials:true,
    headers:{
        'API-KEY':'aee1e098-c1ec-45af-b764-0edfc4a89fa8'
    }
})

export type TodolistType= {
    id: string
    addedDate: string
    order: number
    title: string
}

type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
}

export type TasksResponseType = {
    items:Array<TaskType>
    totalCount:number
    error: null | string
}

export type TaskType = {
    description: string
    title: string
    status: string
    priority: number
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
    status: number
    priority: number
    startDate: string
    deadline: string
}


export const todolistApi = {
    updateTodolist(todolistId:string, title: string){
        return instance.put<ResponseType>(`todo-lists/${todolistId}` ,{title: title})
    },
    deleteTodolist(todolistId:string){
        return  instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    createTodolist(title: string){
        return  instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title})
    },
    getTodolists(){
        return  instance.get<Array<TodolistType>>('todo-lists')
    },

    getTasks(todolistId:string){
        return instance.get<TasksResponseType>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId:string,taskTitle:string){
        return instance.post<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks`, {title: taskTitle} )
    },
    updateTask(todolistId:string, taskId:string, model : modelTaskType ){
        return instance.put<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`, model )
    },
    deleteTask(todolistId:string, taskId:string){
        return instance.delete<ResponseType>( `todo-lists/${todolistId}/tasks/${taskId}`)
    }

}
