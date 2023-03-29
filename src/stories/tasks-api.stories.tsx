import React, {useEffect, useState} from 'react'
import {tasksAPI, TaskType} from "../api/tasks-api"

export default {
  title: 'API TASKS'
}


export const GetTasks = () => {

  const [state, setState] = useState<any>([])

  useEffect(() => {
    const todolistId = "910a0f23-d5ec-4b49-864f-3bd01ff88bf2"

    tasksAPI.getTasks(todolistId)
      .then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}


export const CreateTask = () => {

  const [state, setState] = useState<any>(null)
  // const [taskTitle, setTaskTitle] = useState<string>("")
  // const [todolistId, setTodolistId] = useState<string>("")

  useEffect(() => {
    const title = "SOME TASK 1"
    const todolistId = "3a07e2d5-5468-4949-a44e-8f11a6987673"

    tasksAPI.createTask(todolistId, title)
      .then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}


export const UpdateTaskTitle = () => {

  const [state, setState] = useState<any>(null)

  useEffect(() => {
    const title = "SOME NEW TASK TITLE"
    const taskId = "69fb7286-ec33-4f77-80ac-dfd0dbb4646a"
    const todolistId = "910a0f23-d5ec-4b49-864f-3bd01ff88bf2"

    tasksAPI.updateTask(todolistId, taskId, title)
      .then((res) => setState(res.data.items))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}


export const DeleteTask = () => {

  const [state, setState] = useState<any>(null)

  useEffect(() => {
    const taskId = "a3f08aff-cffa-44c7-af2d-d30e5f718d76"
    const todolistId = "910a0f23-d5ec-4b49-864f-3bd01ff88bf2"

    tasksAPI.deleteTask(todolistId, taskId)
      .then((res) => setState(res.data.items))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}



// <div>
//   <input
//     type="text"
//     placeholder={"todolist id"}
//     value={todolistId}
//     onChange={(e) => setTodolistId(e.currentTarget.value)}
//   />
//   <input
//     type="text"
//     placeholder={"task title"}
//     value={taskTitle}
//     onChange={(e) => setTaskTitle(e.currentTarget.value)}
//   />
//   <button onClick={createTask}>Create Task</button>
// </div>