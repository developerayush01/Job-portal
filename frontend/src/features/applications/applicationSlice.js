import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchMyApplications = createAsyncThunk(
  'applications/fetchMyApplications',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/applications/my-applications');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch applications');
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default applicationSlice.reducer;