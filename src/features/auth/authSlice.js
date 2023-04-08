import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUser } from "./userAPI";

const initialState = {
    user: null,
    status: 'idle',
    error: null,
    callingEventBeforeLogin: null,
    callingEventAfterLogin: null
};

export const fetchUserAsync = createAsyncThunk(
    'auth/fetchUser',
    async () => {
      const response = await fetchUser();
      return response;
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            state.user = action.payload;
        },
        callEventBeforeLogin: (state, action) => {
            state.callingEventBeforeLogin = action.payload;
        },
        callEventAfterLogin: (state, action) => {
            state.callingEventAfterLogin = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchUserAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchUserAsync.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.user = action.payload;
          })
          .addCase(fetchUserAsync.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
          })
      },
});

export const { updateUser, callEventBeforeLogin, callEventAfterLogin } = authSlice.actions;

export const selectCallingEventBeforeLogin = state => state.auth.callingEventBeforeLogin;
export const selectCallingEventAfterLogin = state => state.auth.callingEventAfterLogin;

export default authSlice.reducer;