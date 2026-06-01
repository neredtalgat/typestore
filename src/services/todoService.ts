// services/todoService.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ITodo } from '../types/todo'

export const todoAPI = createApi({
  reducerPath: 'todoAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com'
  }),
  tagTypes: ['Todo'],
  endpoints: (build) => ({
    fetchAllTodos: build.query<ITodo[], number>({
      query: (limit = 10) => ({
        url: '/todos',
        params: { _limit: limit }
      }),
      providesTags: ['Todo']
    }),
  })
})

export const { useFetchAllTodosQuery } = todoAPI