import { useNavigate } from 'react-router-dom'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <span className="text-8xl font-black text-gray-200">404</span>
      <h1 className="text-2xl font-bold text-gray-700">Страница не найдена</h1>
      <p className="text-gray-400 text-sm">Такой страницы не существует</p>
      <button
        onClick={() => navigate('/')}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
      >
        На главную
      </button>
    </div>
  )
}

export default NotFoundPage
