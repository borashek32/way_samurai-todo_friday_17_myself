import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  TodolistType,
  UpdateTaskModelType
} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {setAppStatusAC} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addTodolistAC, removeTodolistAC, setTodolistsAC} from "./todolists-reducer";

const initialState: TasksStateType = {}

const slice = createSlice({
  name: "tasks",
  initialState: initialState,
  reducers: {
    removeTaskAC: (state, action: PayloadAction<{ taskId: string, todolistId: string }>) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index > -1) tasks.splice(index, 1)
    },
    // сам payload является таской, поэтому не обязательно писать payload объектом
    // зачем в payload делать еще свойство task, если туда прилетает один аргумент
    addTaskAC: (state, action: PayloadAction<TaskType>) => {
      state[action.payload.todoListId].unshift(action.payload)
    },
    updateTaskAC: (state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) => {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index > -1) tasks[index] = {...tasks[index], ...action.payload.model}
    },
    SetTasksAC: (state, action: PayloadAction<{ todolistId: string, tasks: TaskType[] }>) => {
      state[action.payload.todolistId] = action.payload.tasks
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id]
    })
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach((tl: any) => state[tl.id] = [])
    })
  }
  // extraReducers: {
  //   [addTodolistAC.type]: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
  //     state[action.payload.todolist.id] = []
  //   },
  //   [removeTodolistAC.type]: (state, action: PayloadAction<{ todolistId: string }>) => {
  //     delete state[action.payload.todolistId]
  //   },
  //   [setTodolistsAC.type]: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
  //     action.payload.todolists.forEach(tl => state[tl.id] = [])
  //   },
  // }
})

export const tasksReducer = slice.reducer

export const {removeTaskAC, addTaskAC, updateTaskAC, SetTasksAC} = slice.actions

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: "loading"}))
  todolistsAPI.getTasks(todolistId)
    .then((res) => {
      dispatch(SetTasksAC({todolistId: todolistId, tasks: res.data.items}))
      dispatch(setAppStatusAC({status: "succeeded"}))
    })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
  todolistsAPI.deleteTask(todolistId, taskId)
    .then(res => dispatch(removeTaskAC({taskId: taskId, todolistId: todolistId})))
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: "loading"}))
  todolistsAPI.createTask(todolistId, title)
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(addTaskAC(res.data.data.item))
        dispatch(setAppStatusAC({status: "succeeded"}))
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
  const task = getState().tasks[todolistId].find(t => t.id === taskId)

  if (!task) {
    console.warn('task not found in the state')
    return
  }

  const apiModel: UpdateTaskModelType = {
    deadline: task.deadline,
    description: task.description,
    priority: task.priority,
    startDate: task.startDate,
    title: task.title,
    status: task.status,
    ...domainModel
  }

  todolistsAPI.updateTask(todolistId, taskId, apiModel)
    .then(res => {
      if (res.data.resultCode === 0) {
        const action = updateTaskAC({taskId: taskId, model: apiModel, todolistId: todolistId})
        dispatch(action)
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => handleServerNetworkError(error, dispatch))
}

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}
