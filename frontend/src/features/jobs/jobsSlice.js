import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchActiveJobs = createAsyncThunk(
  'jobs/fetchActiveJobs',
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get('/jobs/active');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

export const fetchJobById = createAsyncThunk(
  'jobs/fetchJobById',
  async (jobId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/jobs/${jobId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch job');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    list: [],
    selectedJob: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchActiveJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.selectedJob = action.payload;
      });
  }
});

export default jobsSlice.reducer;