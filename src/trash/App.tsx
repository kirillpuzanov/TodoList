// import React, {useState} from 'react';
// import '../app/App.css';
// import {TodoList} from "../features/todolistsList/todolist/TodoList";
// import {v1} from "uuid";
// import {AddItemForm} from "../components/addItemForm/AddItemForm";
// import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
// import {Menu} from "@material-ui/icons";
// import {TaskStatuses, TodoTaskPriorities} from "../api/todolist-api";
// import {FilterValuesType, TodolistDomainType} from "../state/todolists-reducer";
// import {TasksStateType} from "../state/tasks-reducer";
//
//
// function App() {
//
//     let todoListId1 = v1();
//     let todoListId2 = v1();
// // стэйт который обрабатывает тудулисты
//     let [todoLists, setTodoLists] = useState<Array<TodolistDomainType>>([
//         {
//             id: todoListId1, title: 'What to learn?', filter: 'Active', addedDate: '',
//             order: 0,entityStatus: 'idle'
//         },
//         {
//             id: todoListId2, title: 'What to buy?', filter: 'Completed', addedDate: '',
//             order: 0,entityStatus: 'idle'
//         }
//     ]);
//
// // стэйт который обрабатывает таски
//     let [tasksObj, setTasks] = useState<TasksStateType>({
//         [todoListId1]: [
//             {
//                 id: v1(),
//                 title: 'HTML&CSS',
//                 status: TaskStatuses.Completed,
//                 addedDate: '',
//                 description: '',
//                 priority: TodoTaskPriorities.Low,
//                 startDate: '',
//                 deadline: '',
//                 todoListId: todoListId1,
//                 order: 0
//             },
//             {
//                 id: v1(),
//                 title: 'JS',
//                 status: TaskStatuses.New,
//                 addedDate: '',
//                 description: '',
//                 priority: TodoTaskPriorities.Low,
//                 startDate: '',
//                 deadline: '',
//                 todoListId: todoListId1,
//                 order: 0
//             },
//
//         ],
//         [todoListId2]: [
//             {id: v1(), title: 'Mi band 5', status: TaskStatuses.Completed,
//                 addedDate: '',
//                 description: '',
//                 priority: TodoTaskPriorities.Low,
//                 startDate: '',
//                 deadline: '',
//                 todoListId: todoListId1,
//                 order: 0},
//             {id: v1(), title: 'Mouse', status: TaskStatuses.New,
//                 addedDate: '',
//                 description: '',
//                 priority: TodoTaskPriorities.Low,
//                 startDate: '',
//                 deadline: '',
//                 todoListId: todoListId1,
//                 order: 0},
//
//         ]
//     })
//
//     function removeTask(id: string, todoListId: string) {
//         //достаем нужный массив по todoListId
//         let todolistTasks = tasksObj[todoListId];
//         //перезапишем в этом объекте массив для нужного тудулиста отфильрованным массивом
//         tasksObj[todoListId] = todolistTasks.filter((t) => t.id !== id);
//         // сетаем в стейт копию объекта, чтобы реакт отреагировал перерисовкой
//         setTasks({...tasksObj});
//     }
//
//     function addTask(title: string, todoListId: string) {
//         // конструируем новый объект таски
//         let task = {id: v1(), title: title, status: TaskStatuses.New,
//             addedDate: '',
//             description: '',
//             priority: TodoTaskPriorities.Low,
//             startDate: '',
//             deadline: '',
//             todoListId: todoListId1,
//             order: 0};
//         //достаем нужный массив(куда будем добавлять глвую таску) по todoListId
//         let todolistTasks = tasksObj[todoListId];
//         // перезапишем в этом объекте массив для нужного тудулиста копией + новая таска в начале
//         tasksObj[todoListId] = [task, ...todolistTasks];
//         // сетаем в стейт копию объекта, чтобы реакт отреагировал перерисовкой
//         setTasks({...tasksObj})
//     }
//
//     function changeTaskTitle(id: string, newTitle: string, todoListId: string) {
//         let tasks = tasksObj[todoListId];
//         let task = tasks.find(t => t.id === id);
//         if (task) {
//             task.title = newTitle;
//             setTasks({...tasksObj});
//         }
//     }
//
//     function changeStatus(id: string, status: TaskStatuses, todoListId: string) {
//         let tasks = tasksObj[todoListId];
//         let task = tasks.find(t => t.id === id);
//         if (task) {
//             task.status = status;
//         }
//         setTasks({...tasksObj});
//     }
//
//
//     //....................функции для тудулистов
//
//     function changeFilter(todoListId: string, value: FilterValuesType) {
//         let todoList = todoLists.find((tl) => tl.id === todoListId);
//         if (todoList) {
//             todoList.filter = value;
//             setTodoLists([...todoLists])
//         }
//     }
//
//     function removeTodoList(todoListId: string) {
//         // отфильтруем и засунем в стэйт список тудулистов, id которых не равны тому, который нужно удалить
//         setTodoLists(todoLists.filter(tl => tl.id != todoListId));
//         // удалим таски для этого тудулиста из второго стэйта, где мы храним отдельно
//         delete tasksObj[todoListId];// удаляем свойство из объекта tasksObj...значение которого массив
//         //сетаем в стейт копию объекта что-бы реакт отреагировал перерисовкой
//         setTasks({...tasksObj});
//     }
//
//     function addTodoList(title: string) {
//         let newTodoList: TodolistDomainType = {id: v1(), title: title, filter: "All",addedDate: '',entityStatus: 'idle',
//             order: 0}
//         setTodoLists([...todoLists, newTodoList])
//         setTasks({...tasksObj, [newTodoList.id]: []})
//     }
//
//
//     function changeTodoListTitle(todoListId: string, newTitle: string) {
//         //найдем нужный тудулист
//         const todoList = todoLists.find(tl => tl.id === todoListId)
//         if (todoList) {
//             //если нашелся,изменим ему заголовок
//             todoList.title = newTitle
//             setTodoLists([...todoLists])
//         }
//     }
//
//
//     return (
//         <div className="App">
//             <AppBar position="static">
//                 <Toolbar>
//                     <IconButton edge="start" color="inherit" aria-label="menu">
//                         <Menu/>
//                     </IconButton>
//                     <Typography variant="h6">
//                         News
//                     </Typography>
//                     <Button color="inherit">Login</Button>
//                 </Toolbar>
//             </AppBar>
//             <Container fixed>
//                 <Grid container style={{padding: '20px'}}>
//                     <AddItemForm addItem={addTodoList}/>
//                 </Grid>
//                 <Grid container spacing={3}>
//                     {
//                         todoLists.map((tl) => {
//                             let tasksForTodoList = tasksObj[tl.id];
//                         /*    if (tl.filter === 'Completed') {
//                                 tasksForTodoList = tasksForTodoList.filter(t => t.status);
//                             }
//                             if (tl.filter === 'Active') {
//                                 tasksForTodoList = tasksForTodoList.filter(t => !t.status);
//                             }*/
//                             return <Grid item>
//                                 <Paper style={{padding: '10px'}}>
//                                     <TodoList
//                                         key={tl.id}
//                                         id={tl.id}
//                                         title={tl.title}
//                                         entityStatus={tl.entityStatus}
//                                         tasks={tasksForTodoList}
//                                         removeTask={removeTask}
//                                         changeFilter={changeFilter}
//                                         addTask={addTask}
//                                         changeStatus={changeStatus}
//                                         removeTodoList={removeTodoList}
//                                         filter={tl.filter}
//                                         changeTaskTitle={changeTaskTitle}
//                                         changeTodoListTitle={changeTodoListTitle}
//                                     />
//                                 </Paper>
//                             </Grid>
//                         })
//                     }
//                 </Grid>
//             </Container>
//         </div>
//     );
// }
//
// export default App;
export default 1