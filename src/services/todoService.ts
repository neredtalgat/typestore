// services/todoService.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ITodo } from '../types/todo'
import type { RootState } from '../store/store'

export const todoAPI = createApi({
  reducerPath: 'todoAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.user?.token
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Todo'],
  endpoints: (build) => ({
    fetchAllTodos: build.query<ITodo[], number>({
      query: (limit = 10) => ({
        url: '/todos',
        params: { _limit: limit },
      }),
      providesTags: ['Todo'],
    }),
    createTodo: build.mutation<ITodo, Partial<ITodo>>({
      query: (todo) => ({
        url: '/todos',
        method: 'POST',
        body: todo,
      }),
      invalidatesTags: ['Todo'],
    }),
    updateTodo: build.mutation<ITodo, ITodo>({
      query: (todo) => ({
        url: `/todos/${todo.id}`,
        method: `PUT`,
        body: todo,
      }),
      invalidatesTags: ['Todo'],
    }),
    deleteTodo: build.mutation<void, number>({
      query: (id) => ({
        url: `/todos/${id}`,
        method: `DELETE`,
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
})

export const {
  useFetchAllTodosQuery,
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} = todoAPI
