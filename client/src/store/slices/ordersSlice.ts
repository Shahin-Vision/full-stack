import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

interface State { items: any[]; loading: boolean; error: string | null }
const init: State = { items: [], loading: false, error: null }

export const fetchOrders = createAsyncThunk(
  'orders/list',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders/')
      return data.results || data
    } catch (e: any) {
      return rejectWithValue(e.response?.data || 'Failed to fetch orders')
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/create',
  async (d: any, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders/', d)
      return data
    } catch (e: any) {
      // ✅ Return actual Django error so toast can show it
      const err = e.response?.data
      const msg = typeof err === 'string'
        ? err
        : err?.detail || JSON.stringify(err) || 'Failed to place order'
      return rejectWithValue(msg)
    }
  }
)

const sl = createSlice({
  name: 'orders',
  initialState: init,
  reducers: {},
  extraReducers: b => b
    .addCase(fetchOrders.pending,   s => { s.loading = true; s.error = null })
    .addCase(fetchOrders.fulfilled, (s, a) => { s.loading = false; s.items = a.payload })
    .addCase(fetchOrders.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string })
    .addCase(createOrder.pending,   s => { s.loading = true; s.error = null })
    .addCase(createOrder.fulfilled, (s, a) => { s.loading = false; s.items = [a.payload, ...s.items] })
    .addCase(createOrder.rejected,  (s, a) => { s.loading = false; s.error = a.payload as string })
})

export default sl.reducer