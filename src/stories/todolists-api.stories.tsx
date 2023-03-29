import React, {useEffect, useState} from 'react'
import {todolistAPI} from "../api/todolist-api"

export default {
  title: 'API'
}


export const GetTodolists = () => {

  const [state, setState] = useState<any>(null)

  useEffect(() => {
    // здесь мы будем делать запрос и ответ закидывать в стейт.
    // который в виде строки будем отображать в div-ке
    todolistAPI.getTodolist()
      .then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}


export const CreateTodolist = () => {

  const [state, setState] = useState<any>(null)

  useEffect(() => {
    const title = "SOME NAME"
    todolistAPI.createTodolist(title)
      .then(res => setState(res.data.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}


export const UpdateTodolistTitle = () => {

  const [state, setState] = useState<any>(null)

  useEffect(() => {
    const todolistId = "3a07e2d5-5468-4949-a44e-8f11a6987673"
    const title = 'SOME NEW TITLE'
    todolistAPI.updateTodolist(todolistId, title)
      .then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}


export const DeleteTodolist = () => {

  const [state, setState] = useState<any>(null)

  useEffect(() => {
    const todolistId = "09b85588-e0e5-45f1-bc3b-11bdca5dc1fa"
    todolistAPI.deleteTodolist(todolistId)
      .then((res) => setState(res.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}