import { ITodo } from '../types/todo'

export interface IUser {
  id: number
  email: string
  password: string
}

// Тестовые пользователи
export const users: IUser[] = [
  { id: 1, email: 'admin@test.com', password: 'admin123' },
  { id: 2, email: 'user@test.com', password: 'user123' },
]

// Начальные задачи
export const todos: ITodo[] = [
  { id: 1, title: 'Изучить React', completed: true, userId: 1 },
  { id: 2, title: 'Написать тесты', completed: false, userId: 1 },
  { id: 3, title: 'Подключить MSW', completed: false, userId: 1 },
  { id: 4, title: 'Задеплоить проект', completed: false, userId: 2 },
]

let nextTodoId = todos.length + 1

export const getNextTodoId = () => nextTodoId++
