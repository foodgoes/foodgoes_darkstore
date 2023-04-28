import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCart, updateCart, checkDiscountCart, deleteCart } from "./cartAPI";

const initialState = {
    cart: {
      totalShippingPrice: 0,
      totalLineItemsPrice: 0,
      totalDiscounts: 0,
      subtotalPrice: 0,
      totalPrice: 0,
      minTotalPrice: 0,
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

export const deleteCartAsync = createAsyncThunk(
  'cart/deleteCart',
  async initialPost => {
    const response = await deleteCart(initialPost);
    return response;
  }
);

export const checkDiscountCartAsync = createAsyncThunk(
    'cart/checkDiscountCart',
    async initialPost => {
      const response = await checkDiscountCart(initialPost);
      return response;
    }
);

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      clearCart: (state, action) => {
        state.cart = {
          totalPrice: 0,
          products: []
        };
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

        builder
          .addCase(deleteCartAsync.fulfilled, (state, action) => {
            state.cart = {
              totalPrice: 0,
              products: []
            };
          })

        builder
          .addCase(checkDiscountCartAsync.fulfilled, (state, action) => {
            state.cart.discountChanged = action.payload;
          })
    }
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;