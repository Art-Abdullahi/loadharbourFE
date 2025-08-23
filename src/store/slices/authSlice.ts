import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { User, AuthState } from '../../types';
import { debug } from '../../utils/debug';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      debug.log('AuthSlice', 'Login attempt', credentials.email);
      const response = await api.auth.login(credentials);
      debug.log('AuthSlice', 'Login successful');
      return response;
    } catch (err: any) {
      debug.error('AuthSlice', 'Login failed', err);
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: User['role'];
  }, { rejectWithValue }) => {
    try {
      debug.log('AuthSlice', 'Register attempt', userData.email);
      const response = await api.auth.register(userData);
      debug.log('AuthSlice', 'Register successful');
      return response;
    } catch (err: any) {
      debug.error('AuthSlice', 'Register failed', err);
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      debug.log('AuthSlice', 'Logout attempt');
      await api.auth.logout();
      debug.log('AuthSlice', 'Logout successful');
    } catch (err: any) {
      debug.error('AuthSlice', 'Logout failed', err);
      return rejectWithValue(err.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Login failed';
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Registration failed';
      })

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      })
      .addCase(logout.rejected, (state) => {
        return initialState;
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;