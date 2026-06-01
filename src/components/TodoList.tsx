// components/TodoList.tsx
import { useFetchAllTodosQuery } from '../services/todoService'

const TodoList = () => {
  const { data: todos, isLoading, isError } = useFetchAllTodosQuery(10)

  if (isLoading) return <div>Загрузка...</div>
  if (isError) return <div>Ошибка!</div>

  return (
    <ul>
      {todos?.map(todo => (
        <li key={todo.id}>
          {todo.completed ? '✓' : '○'} {todo.title}
        </li>
      ))}
    </ul>
  )
}

export default TodoList