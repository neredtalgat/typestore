import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setCredentials } from '../store/authSlice'
import { useAppDispatch } from '../store/hooks'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogin = () => {
    dispatch(setCredentials({ id: 1, email, token: 'fake-jwt-token' }))
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Добро пожаловать</h1>
        <p className="text-gray-400 mb-8 text-sm">Войдите в свой аккаунт</p>

        <div className="flex flex-col gap-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            type="password"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 transition"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
