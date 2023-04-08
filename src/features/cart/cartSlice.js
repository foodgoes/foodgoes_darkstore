import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCart } from "./cartAPI";

const initialState = {
    cart: {
      total: 0, 
      products: []
    },
    status: 'idle',
    error: null
};

export const fetchCartAsync = createAsyncThunk(
    'cart/fetchCart',
    async () => {
      const response = await fetchCart();
      return response;
    }
);

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      updateCart: (state, action) => {
        state.cart = {...state.cart, ...action.payload};
      },
      deleteCart: (state, action) => {
        state.cart = {total: 0, products: []};
      }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchCartAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchCartAsync.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.cart = action.payload;
          })
          .addCase(fetchCartAsync.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
    }
});

export const { updateCart, deleteCart } = cartSlice.actions;

export default cartSlice.reducer;