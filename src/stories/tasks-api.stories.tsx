import React, {useEffect, useState} from 'react'
import {todolistsAPI} from "../api/todolists-api"

export default {
  title: 'API TASKS'
}

export const GetTasks = () => {

  const [state, setState] = useState<any>([])

  useEffect(() => {
    const todolistId = "a9d75340-2611-46c7-bdf1-40b94260d5cf"

    todolistsAPI.getTasks(todolistId)
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
    const todolistId = "a9d75340-2611-46c7-bdf1-40b94260d5cf"

    todolistsAPI.createTask(todolistId, title)
      .then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}


// export const UpdateTaskTitle = () => {
//
//   const [state, setState] = useState<any>(null)
//
//   useEffect(() => {
//     const title = "SOME NEW TASK TITLE"
//     const taskId = "69fb7286-ec33-4f77-80ac-dfd0dbb4646a"
//     const todolistId = "910a0f23-d5ec-4b49-864f-3bd01ff88bf2"
//
//     todolistsAPI.updateTask(todolistId, taskId, {title: "SOME NEW TASK TITLE"})
//       .then((res) => setState(res.data.items))
//   }, [])
//
//   return <div>{JSON.stringify(state)}</div>
// }
//
//
// export const DeleteTask = () => {
//
//   const [state, setState] = useState<any>(null)
//
//   useEffect(() => {
//     const taskId = "a3f08aff-cffa-44c7-af2d-d30e5f718d76"
//     const todolistId = "910a0f23-d5ec-4b49-864f-3bd01ff88bf2"
//
//     todolistsAPI.deleteTask(todolistId, taskId)
//       .then((res) => setState(res.data.items))
//   }, [])
//
//   return <div>{JSON.stringify(state)}</div>
// }