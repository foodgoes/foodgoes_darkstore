import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import locationSlice from './features/location/locationSlice';
import cartSlice from './features/cart/cartSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    location: locationSlice,
    cart: cartSlice
  }
})