import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import PrivateRoute from '../components/PrivateRoute'
import authReducer from '../store/authSlice'

// Вспомогательная функция — создаёт store с нужным состоянием
const makeStore = (user: null | object) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user: user as never } },
  })

describe('PrivateRoute', () => {
  it('редиректит на /login если не залогинен', () => {
    const store = makeStore(null)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PrivateRoute>
            <div>Закрытая страница</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.queryByText('Закрытая страница')).not.toBeInTheDocument()
  })

  it('показывает контент если залогинен', () => {
    const store = makeStore({ id: 1, email: 'test@test.com', token: 'abc' })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <PrivateRoute>
            <div>Закрытая страница</div>
          </PrivateRoute>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Закрытая страница')).toBeInTheDocument()
  })
})
