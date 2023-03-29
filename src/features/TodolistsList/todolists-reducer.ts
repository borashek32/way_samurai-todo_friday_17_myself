import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {handleServerNetworkError} from '../../utils/error-utils'
import {AppThunk} from '../../app/store';
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
  name: "todolists",
  initialState: initialState,
  reducers: {
    removeTodolistAC: (state, action: PayloadAction<{ id: string }>) => {
      // state.filter(tl => tl.id != action.payload.id) // вместо того, что ниже
      // здесь важно делать изменения мутабельно,
      // потому что работаем с draftState
      const index = state.findIndex(tl => tl.id === action.payload.id)
      if (index > -1) state.splice(index, 1)
    },
    addTodolistAC: (state, action: PayloadAction<{ todolist: TodolistType}>) => {
      state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
    },
    changeTodolistTitleAC: (state, action: PayloadAction<{ id: string, title: string }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].title = action.payload.title
      // здесь важно делать изменения мутабельно,
      // потому что работаем с draftState
      // state.map(tl => tl.id === action.payload.id ? {...tl, title: action.payload.title} : tl)
    },
    changeTodolistFilterAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].filter = action.payload.filter
      // здесь важно делать изменения мутабельно,
      // потому что работаем с draftState
      // state.map(tl => tl.id === action.payload.id ? {...tl, filter: action.payload.filter} : tl)
    },
    changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
      const index = state.findIndex(tl => tl.id === action.payload.id)
      state[index].entityStatus = action.payload.status
      // здесь важно делать изменения мутабельно,
      // потому что работаем с draftState
      // state.map(tl => tl.id === action.payload.id ? {...tl, entityStatus: action.payload.status} : tl)
    },
    setTodolistsAC: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
      return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
    }
  }
})

export const todolistsReducer = slice.reducer

export const {
  setTodolistsAC,
  changeTodolistEntityStatusAC,
  removeTodolistAC,
  addTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC
} = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todolistsAPI.getTodolists()
      .then((res) => {
        dispatch(setTodolistsAC({todolists: res.data}))
        dispatch(setAppStatusAC({status: "succeeded"}))
      })
      .catch(error => handleServerNetworkError(error, dispatch))
  }
}
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: "loading"}))
    todolistsAPI.deleteTodolist(todolistId)
      .then((res) => {
        dispatch(removeTodolistAC({id: todolistId}))
        dispatch(setAppStatusAC({status: "succeeded"}))
      })
  }
}
export const addTodolistTC = (title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todolistsAPI.createTodolist(title)
      .then((res) => {
        dispatch(addTodolistAC({todolist: res.data.data.item}))
        dispatch(setAppStatusAC({status: "succeeded"}))
      })
  }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(id, title)
      .then((res) => dispatch(changeTodolistTitleAC({id: id, title: title})))
  }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
