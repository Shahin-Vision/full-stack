import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
}

interface State {
  user: User | null
  token: string | null   // ✅ added
  loading: boolean
  error: string | null
}

const storedUser  = localStorage.getItem('user')
const storedToken = localStorage.getItem('access_token')

const init: State = {
  user:    storedUser  ? JSON.parse(storedUser) : null,
  token:   storedToken ?? null,   // ✅ hydrate from localStorage on page load
  loading: false,
  error:   null,
}

/* ── Thunks ── */
export const login = createAsyncThunk(
  'auth/login',
  async (c: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login/', c)
      localStorage.setItem('access_token',  data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { user: data.user, token: data.access }   // ✅ return token
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.error || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (d: any, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register/', d)
      localStorage.setItem('access_token',  data.access)
      localStorage.setItem('refresh_token', data.refresh)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { user: data.user, token: data.access }   // ✅ return token
    } catch (e: any) {
      return rejectWithValue(e.response?.data || 'Registration failed')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/profile',
  async (d: Partial<User>, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/auth/profile/', d)
      localStorage.setItem('user', JSON.stringify(data))
      return data
    } catch {
      return rejectWithValue('Update failed')
    }
  }
)

/* ── Slice ── */
const authSlice = createSlice({
  name: 'auth',
  initialState: init,
  reducers: {
    logout(s) {
      s.user  = null
      s.token = null   // ✅ clear token on logout
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    },
    clearError(s) {
      s.error = null
    },
    // ✅ Called by api.ts interceptor after silent token refresh
    setToken(s, action) {
      s.token = action.payload
      localStorage.setItem('access_token', action.payload)
    },
  },
  extraReducers: b => b
    .addCase(login.pending,    s => { s.loading = true;  s.error = null })
    .addCase(login.fulfilled,  (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token })
    .addCase(login.rejected,   (s, a) => { s.loading = false; s.error = a.payload as string })

    .addCase(register.pending,    s => { s.loading = true;  s.error = null })
    .addCase(register.fulfilled,  (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token })
    .addCase(register.rejected,   (s, a) => { s.loading = false; s.error = a.payload as string })

    .addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload })
})

export const { logout, clearError, setToken } = authSlice.actions
export default authSlice.reducer