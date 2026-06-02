import { useNavigate } from 'react-router-dom'
import { setCredentials } from '../store/authSlice'
import { useAppDispatch } from '../store/hooks'
import { useLoginMutation } from '../services/todoService'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
})

type LoginForm = z.infer<typeof loginSchema>

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [login, { isLoading, error }] = useLoginMutation()

  const handleLogin = async (data: LoginForm) => {
    try {
      const result = await login(data).unwrap()
      dispatch(setCredentials(result))
      navigate('/')
    } catch {
      // ошибка отображается через RTK Query error
    }
  }

  const errorMessage = error
    ? 'data' in error
      ? (error.data as { message: string }).message
      : 'Ошибка соединения с сервером'
    : null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Добро пожаловать</h1>
        <p className="text-gray-400 mb-8 text-sm">Войдите в свой аккаунт</p>

        <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <input
              {...register('email')}
              placeholder="Email"
              type="text"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.email && (
              <span className="text-red-400 text-xs">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <input
              {...register('password')}
              placeholder="Пароль"
              type="password"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.password && (
              <span className="text-red-400 text-xs">{errors.password.message}</span>
            )}
          </div>

          {errorMessage && (
            <p className="text-red-400 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition"
          >
            {isLoading ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <p className="text-gray-400 text-xs text-center mt-6">
          Тест: admin@test.com / admin123
        </p>
      </div>
    </div>
  )
}

export default LoginPage
