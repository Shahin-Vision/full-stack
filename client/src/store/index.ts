import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/authSlice'
import cart from './slices/cartSlice'
import products from './slices/productsSlice'
import orders from './slices/ordersSlice'
export const store = configureStore({ reducer:{auth,cart,products,orders} })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
