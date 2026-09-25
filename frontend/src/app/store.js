import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import jobsReducer from '../features/jobs/jobsSlice';
import companyReducer from '../features/companies/companySlice';
import applicationReducer from '../features/applications/applicationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    companies: companyReducer,
    applications: applicationReducer
  }
});