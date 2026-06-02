import { useAppDispatch, useAppSelector } from '../store/hooks'
import { useNavigate } from 'react-router-dom'
import TodoList from '../components/TodoList'
import { logout } from '../store/authSlice'

function TodosPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">TypeStore</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-600 transition"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Мои задачи</h2>
          <p className="text-gray-400 text-sm mt-1">Управляйте своим списком дел</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <TodoList />
        </div>
      </main>
    </div>
  )
}

export default TodosPage
