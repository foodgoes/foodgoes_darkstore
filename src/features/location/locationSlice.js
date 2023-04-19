import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchLocation } from "./locationAPI";

const initialState = {
    location: null,
    status: 'idle',
    error: null
};

export const fetchLocationAsync = createAsyncThunk(
    'location/fetchLocation',
    async () => {
      const response = await fetchLocation();
      return response;
    }
);

export const locationSlice = createSlice({
    name: 'location',
    initialState,
    reducers: {
        updateLocation: (state, action) => {
            state.location = action.payload;
        },
        updateLocationAddress: (state, action) => {
            state.location.address = action.payload;
        },
        logProductIdBeforelocation: (state, action) => {
            state.productIdBeforelocation = action.payload;
        },
        logProductIdAfterlocation: (state, action) => {
            state.productIdAfterlocation = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchLocationAsync.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchLocationAsync.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.location = action.payload;
          })
          .addCase(fetchLocationAsync.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
          })
    }
});

export const { updateLocation, updateLocationAddress, logProductIdBeforelocation, logProductIdAfterlocation } = locationSlice.actions;

export const selectProductIdBeforelocation = state => state.location.productIdBeforelocation;
export const selectProductIdAfterlocation = state => state.location.productIdAfterlocation;

export default locationSlice.reducer;