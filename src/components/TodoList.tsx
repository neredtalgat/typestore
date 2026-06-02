import { useState } from 'react'
import {
  useFetchAllTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from '../services/todoService'
import { ITodo } from '../types/todo'

const TodoList = () => {
  const [title, setTitle] = useState('')
  const [mutationError, setMutationError] = useState<string | null>(null)

  const { data: todos, isLoading, isError, refetch } = useFetchAllTodosQuery()
  const [createTodo] = useCreateTodoMutation()
  const [updateTodo] = useUpdateTodoMutation()
  const [deleteTodo] = useDeleteTodoMutation()

  const handleCreate = async () => {
  if (!title.trim()) return
  try {
    await createTodo({ title }).unwrap()
    setTitle('')
    setMutationError(null)
  } catch {
    setMutationError('Не удалось создать задачу')
  }
}

const handleToggle = async (todo: ITodo) => {
  try {
    await updateTodo({ ...todo, completed: !todo.completed }).unwrap()
    setMutationError(null)
  } catch {
    setMutationError('Не удалось обновить задачу')
  }
}

const handleDelete = async (id: number) => {
  try {
    await deleteTodo(id).unwrap()
    setMutationError(null)
  } catch {
    setMutationError('Не удалось удалить задачу')
  }
}


  if (isLoading)
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Загрузка задач...
      </div>
    )

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center h-40 gap-3">
        <p className="text-red-400 text-sm">Не удалось загрузить задачи</p>
        <button
          onClick={refetch}
          className="text-sm text-blue-600 hover:text-blue-800 underline transition"
        >
          Попробовать снова
        </button>
      </div>
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Новая задача..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 rounded-xl transition"
        >
          Добавить
        </button>
      </div>

      {mutationError && (
        <p className="text-red-400 text-sm text-center">{mutationError}</p>
      )}

      <ul className="flex flex-col gap-2">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition group"
          >
            <span
              onClick={() => handleToggle(todo)}
              className={`text-sm cursor-pointer select-none ${
                todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
              }`}
            >
              {todo.title}
            </span>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition ml-4 shrink-0"
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
