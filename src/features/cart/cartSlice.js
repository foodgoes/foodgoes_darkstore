import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCart, updateCart } from "./cartAPI";

const initialState = {
    cart: {
      total: 0, 
      products: []
    },
    statusOfUpdate: 'idle',
    error: null
};

export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const response = await fetchCart();
    return response;
  }
);

export const updateCartAsync = createAsyncThunk(
    'cart/updateCart',
    async initialPost => {
      const response = await updateCart(initialPost);
      return response;
    }
);

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      deleteCart: (state, action) => {
        state.cart = {total: 0, products: []};
      }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchCartAsync.fulfilled, (state, action) => {
            state.cart = action.payload;
          })

        builder
          .addCase(updateCartAsync.pending, (state) => {
            state.statusOfUpdate = 'loading';
          })
          .addCase(updateCartAsync.fulfilled, (state, action) => {
            state.statusOfUpdate = 'succeeded';
            state.cart = action.payload;
          })
    }
});

export const { deleteCart } = cartSlice.actions;

export default cartSlice.reducer;