import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import LoginPage from '../pages/LoginPage'
import authReducer from '../store/authSlice'

const renderLoginPage = () => {
  const store = configureStore({ reducer: { auth: authReducer } })

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

  it('диспатчит setCredentials и редиректит при верных данных', async () => {
    const user = userEvent.setup()
    const { store } = renderLoginPage()

    await user.type(screen.getByPlaceholderText('Email'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('Пароль'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Войти' }))

    const state = store.getState().auth
    expect(state.user?.token).toBe('fake-jwt-token')
    expect(state.user?.email).toBe('test@test.com')
  })
})