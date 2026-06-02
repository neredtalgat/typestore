import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import LoginPage from '../pages/LoginPage'
import authReducer from '../store/authSlice'
import { todoAPI } from '../services/todoService'

const renderLoginPage = () => {
  const store = configureStore({
    reducer: { auth: authReducer, [todoAPI.reducerPath]: todoAPI.reducer },
    middleware: (getDefault) => getDefault().concat(todoAPI.middleware),
  })

  render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  )

  return { store }
}

describe('LoginPage', () => {
  it('рендерит форму с полями и кнопкой', () => {
    renderLoginPage()

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument()
  })

  it('показывает ошибки при пустой отправке', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('Введите корректный email')).toBeInTheDocument()
    expect(await screen.findByText('Пароль минимум 6 символов')).toBeInTheDocument()
  })

  it('показывает ошибку при некорректном email', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByPlaceholderText('Email'), 'notanemail')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('Введите корректный email')).toBeInTheDocument()
  })

  it('показывает ошибку при коротком пароле', async () => {
    const user = userEvent.setup()
    renderLoginPage()

    await user.type(screen.getByPlaceholderText('Email'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('Пароль'), '123')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('Пароль минимум 6 символов')).toBeInTheDocument()
  })

  it('сохраняет пользователя в store при верных данных', async () => {
    const user = userEvent.setup()
    const { store } = renderLoginPage()

    await user.type(screen.getByPlaceholderText('Email'), 'admin@test.com')
    await user.type(screen.getByPlaceholderText('Пароль'), 'admin123')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    await waitFor(() => {
      const state = store.getState().auth
      expect(state.user?.email).toBe('admin@test.com')
      expect(state.user?.token).toBeTruthy()
    })
  })
})