import { createSlice, PayloadAction } from '@reduxjs/toolkit'
export interface CartItem { id:number; name:string; price:number; image:string; quantity:number; size:string; color:string }
interface State { items:CartItem[]; promoCode:string; discount:number }
const PROMOS:Record<string,number> = {SAVE20:20,SHOP10:10,FIRST15:15}
const saved = localStorage.getItem('cart_items')
const init: State = { items:saved?JSON.parse(saved):[], promoCode:'', discount:0 }
const save = (items:CartItem[]) => localStorage.setItem('cart_items',JSON.stringify(items))

export const cartSlice = createSlice({ name:'cart', initialState:init,
  reducers:{
    addItem(state,{payload}:PayloadAction<CartItem>){
      const ex=state.items.find(i=>i.id===payload.id&&i.size===payload.size&&i.color===payload.color)
      if(ex) ex.quantity+=payload.quantity; else state.items.push(payload); save(state.items)
    },
    removeItem(state,{payload}:PayloadAction<{id:number;size:string;color:string}>){
      state.items=state.items.filter(i=>!(i.id===payload.id&&i.size===payload.size&&i.color===payload.color)); save(state.items)
    },
    updateQuantity(state,{payload}:PayloadAction<{id:number;size:string;color:string;quantity:number}>){
      const i=state.items.find(x=>x.id===payload.id&&x.size===payload.size&&x.color===payload.color); if(i) i.quantity=Math.max(1,payload.quantity); save(state.items)
    },
    applyPromo(state,{payload}:PayloadAction<string>){ const c=payload.toUpperCase(); if(PROMOS[c]){state.promoCode=c;state.discount=PROMOS[c]} },
    clearCart(state){ state.items=[];state.promoCode='';state.discount=0;localStorage.removeItem('cart_items') }
  }
})
export const { addItem, removeItem, updateQuantity, applyPromo, clearCart } = cartSlice.actions
export default cartSlice.reducer
