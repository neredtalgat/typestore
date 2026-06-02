
import { configureStore } from '@reduxjs/toolkit'
import { todoAPI } from '../services/todoService'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [todoAPI.reducerPath]: todoAPI.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(todoAPI.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch