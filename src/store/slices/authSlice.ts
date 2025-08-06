import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: string;
  sessionTimeout: number;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastActivity: new Date().toISOString(),
  sessionTimeout: 30 * 60 * 1000, // 30分
};

// デモ用ログイン関数
const simulateLogin = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  // デモデータ
  const demoUsers: Record<string, User> = {
    'owner@example.com': {
      id: 'owner-001',
      email: 'owner@example.com',
      role: 'owner',
      profile: {
        name: '鈴木一郎',
        company_name: '鈴木不動産',
        phone: '03-1234-5678',
      },
      permissions: ['all'],
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
      last_login: new Date().toISOString(),
    },
    'tenant@yamada.com': {
      id: 'tenant-001',
      email: 'tenant@yamada.com',
      role: 'tenant',
      profile: {
        name: '山田太郎',
        company_name: '山田製作所',
        phone: '03-2345-6789',
      },
      permissions: ['tenant_basic'],
      created_at: '2025-01-15T00:00:00Z',
      updated_at: '2025-01-15T00:00:00Z',
      last_login: new Date().toISOString(),
    },
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = demoUsers[credentials.email];
      if (user && credentials.password === 'password') {
        resolve({
          user,
          token: `demo-token-${user.id}`,
        });
      } else {
        reject(new Error('メールアドレスまたはパスワードが正しくありません'));
      }
    }, 1000);
  });
};

// 非同期アクション
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await simulateLogin(credentials);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },
    clearError: (state) => {
      state.error = null;
    },
    refreshSession: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.lastActivity = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.lastActivity = new Date().toISOString();
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isLoading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, updateActivity, clearError, refreshSession } = authSlice.actions;
export default authSlice.reducer;