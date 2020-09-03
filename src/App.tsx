import React, {useState} from 'react';
import './App.css';
import {TodoList} from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, IconButton, Typography, Toolbar, Container, Grid, Paper} from "@material-ui/core";
import {Menu} from "@material-ui/icons";


export type FilterValuesType = 'All' | 'Active' | 'Completed';
type ToDoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

function App() {

    let todoListId1 = v1();
    let todoListId2 = v1();

    let [todoLists, setTodoLists] = useState<Array<ToDoListType>>([
        {id: todoListId1, title: 'What to learn?', filter: 'Active'},
        {id: todoListId2, title: 'What to buy?', filter: 'Completed'}
    ]);

    let [tasksObj, setTasks] = useState({
        [todoListId1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: false},
            {id: v1(), title: 'ReactJS', isDone: false},
            {id: v1(), title: 'Rest API', isDone: false},
            {id: v1(), title: 'GraphQL', isDone: false}
        ],
        [todoListId2]: [
            {id: v1(), title: 'Mi band 5', isDone: true},
            {id: v1(), title: 'Mouse', isDone: false},
            {id: v1(), title: 'Screwdrivers', isDone: false},
            {id: v1(), title: 'Phone for sister', isDone: false}
        ]
    })


    function addTask(title: string, todoListId: string) {
        let task = {id: v1(), title: title, isDone: false};
        let tasks = tasksObj[todoListId];
        let newTasks = [task, ...tasks];
        tasksObj[todoListId] = newTasks;
        setTasks({...tasksObj})
    }

    function changeStatus(id: string, isDone: boolean, todoListId: string) {
        let tasks = tasksObj[todoListId];
        let task = tasks.find(t => t.id === id);
        if (task) {
            task.isDone = isDone;
            setTasks({...tasksObj});
        }
    }

    function removeTask(id: string, todoListId: string) {
        let tasks = tasksObj[todoListId];
        let filterTasks = tasks.filter((t) => t.id !== id);
        tasksObj[todoListId] = filterTasks
        setTasks({...tasksObj});
    }

    function changeFilter(value: FilterValuesType, todoListId: string) {
        let todoList = todoLists.find((tl) => tl.id === todoListId);
        if (todoList) {
            todoList.filter = value;
            setTodoLists([...todoLists])
        }
    }

    function removeTodoList(todoListId: string) {
        let filterTodoLists = todoLists.filter((tl) => tl.id !== todoListId);
        setTodoLists(filterTodoLists);
        delete tasksObj[todoListId];
        setTasks({...tasksObj});
    }

    function addTodoList(title: string) {
        let newTodoList: ToDoListType = {id: v1(), title: title, filter: "All"}
        setTodoLists([...todoLists, newTodoList])
        setTasks({...tasksObj, [newTodoList.id]: []})
    }

    function changeTaskTitle(id: string, newTitle: string, todoListId: string) {
        let tasks = tasksObj[todoListId];
        let task = tasks.find(t => t.id === id);
        if (task) {
            task.title = newTitle;
            setTasks({...tasksObj});
        }
    }

    function changeTodoListTitle(newTitle: string, todoListId: string) {
        let todoList = todoLists.find(tl => tl.id === todoListId)
        if (todoList) {
            todoList.title = newTitle
            setTodoLists([...todoLists])
        }
    }


    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding:'20px'}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                    todoLists.map((tl) => {
                        let tasksForTodoList = tasksObj[tl.id];
                        if (tl.filter === 'Completed') {
                            tasksForTodoList = tasksForTodoList.filter(t => t.isDone);
                        }
                        if (tl.filter === 'Active') {
                            tasksForTodoList = tasksForTodoList.filter(t => !t.isDone);
                        }
                        return <Grid item>
                            <Paper style={{padding:'10px'}}>
                                <TodoList
                                key={tl.id}
                                id={tl.id}
                                title={tl.title}
                                tasks={tasksForTodoList}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeStatus={changeStatus}
                                removeTodoList={removeTodoList}
                                filter={tl.filter}
                                changeTaskTitle={changeTaskTitle}
                                changeTodoListTitle={changeTodoListTitle}
                            />
                            </Paper>
                        </Grid>
                    })
                }
                </Grid>
            </Container>
        </div>
    );
}

export default App;
