import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number
  email: string
  token: string
}

interface AuthState {
  user: User | null
}

const initialState: AuthState = {
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {setCredentials: (state, action: PayloadAction<User>) => {
    state.user = action.payload
  },

  logout: (state) => {
    state.user = null;
  }
}
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
