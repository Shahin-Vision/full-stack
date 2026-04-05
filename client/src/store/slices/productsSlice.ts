import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'
export interface Product { id:number; name:string; slug:string; price:number; original_price?:number; discount:number; image:string; image2_url?:string|null; image3_url?:string|null; rating:number; review_count:number; colors:string[]; sizes:string[]; style:string; is_new:boolean; is_sale:boolean; category_name?:string; description?:string; reviews?:any[] }
interface State { items:Product[]; count:number; loading:boolean; error:string|null; current:Product|null; currentLoading:boolean }
const init:State = {items:[],count:0,loading:false,error:null,current:null,currentLoading:false}

export const fetchProducts = createAsyncThunk('products/list', async(params:any,{rejectWithValue})=>{
  try{const{data}=await api.get('/products/',{params});return data}catch{return rejectWithValue('Failed')}
})
export const fetchProduct = createAsyncThunk('products/one', async(id:number,{rejectWithValue})=>{
  try{const{data}=await api.get(`/products/${id}/`);return data}catch{return rejectWithValue('Not found')}
})

const sl=createSlice({name:'products',initialState:init,reducers:{},
  extraReducers:b=>b
    .addCase(fetchProducts.pending,s=>{s.loading=true;s.error=null})
    .addCase(fetchProducts.fulfilled,(s,a)=>{s.loading=false;s.items=a.payload.results||a.payload;s.count=a.payload.count||(a.payload.results||a.payload).length})
    .addCase(fetchProducts.rejected,(s,a)=>{s.loading=false;s.error=a.payload as string})
    .addCase(fetchProduct.pending,s=>{s.currentLoading=true})
    .addCase(fetchProduct.fulfilled,(s,a)=>{s.currentLoading=false;s.current=a.payload})
    .addCase(fetchProduct.rejected,s=>{s.currentLoading=false})
})
export default sl.reducer