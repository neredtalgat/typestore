import { http, HttpResponse, delay } from 'msw'
import { users, todos, getNextTodoId } from './db'

const getUserIdFromToken = (request: Request): number | null => {
  const auth = request.headers.get('authorization')
  if (!auth) return null
  try {
    const token = auth.replace('Bearer ', '')
    const decoded = atob(token)
    const userId = parseInt(decoded.split(':')[1])
    return isNaN(userId) ? null : userId
  } catch {
    return null
  }
}

const makeToken = (userId: number) => btoa(`user:${userId}:${Date.now()}`)

export const createHandlers = (baseUrl: string) => [
  http.post(`${baseUrl}/auth/login`, async ({ request }) => {
    await delay(400)
    const body = (await request.json()) as { email: string; password: string }
    const user = users.find((u) => u.email === body.email && u.password === body.password)
    if (!user) {
      return HttpResponse.json({ message: 'Неверный email или пароль' }, { status: 401 })
    }
    return HttpResponse.json({ id: user.id, email: user.email, token: makeToken(user.id) })
  }),

  http.get(`${baseUrl}/todos`, async ({ request }) => {
    await delay(300)
    const userId = getUserIdFromToken(request)
    if (!userId) return HttpResponse.json({ message: 'Не авторизован' }, { status: 401 })
    return HttpResponse.json(todos.filter((t) => t.userId === userId))
  }),

  http.post(`${baseUrl}/todos`, async ({ request }) => {
    await delay(300)
    const userId = getUserIdFromToken(request)
    if (!userId) return HttpResponse.json({ message: 'Не авторизован' }, { status: 401 })
    const body = (await request.json()) as { title: string }
    const newTodo = { id: getNextTodoId(), title: body.title, completed: false, userId }
    todos.push(newTodo)
    return HttpResponse.json(newTodo, { status: 201 })
  }),

  http.put(`${baseUrl}/todos/:id`, async ({ request, params }) => {
    await delay(300)
    const userId = getUserIdFromToken(request)
    if (!userId) return HttpResponse.json({ message: 'Не авторизован' }, { status: 401 })
    const id = parseInt(params.id as string)
    const index = todos.findIndex((t) => t.id === id && t.userId === userId)
    if (index === -1) return HttpResponse.json({ message: 'Задача не найдена' }, { status: 404 })
    const body = (await request.json()) as { title: string; completed: boolean }
    todos[index] = { ...todos[index], ...body }
    return HttpResponse.json(todos[index])
  }),

  http.delete(`${baseUrl}/todos/:id`, async ({ request, params }) => {
    await delay(300)
    const userId = getUserIdFromToken(request)
    if (!userId) return HttpResponse.json({ message: 'Не авторизован' }, { status: 401 })
    const id = parseInt(params.id as string)
    const index = todos.findIndex((t) => t.id === id && t.userId === userId)
    if (index === -1) return HttpResponse.json({ message: 'Задача не найдена' }, { status: 404 })
    todos.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
