import { Middleware } from '@reduxjs/toolkit';
import { logout, updateActivity } from './slices/authSlice';
import { addToast } from './slices/uiSlice';

// セッションタイムアウトミドルウェア
export const sessionTimeoutMiddleware: Middleware<{}, any> = (store) => (next) => (action: any) => {
  const result = next(action);

  // ユーザーアクティビティの監視
  if (action.type && (action.type.endsWith('/fulfilled') || action.type.endsWith('/pending'))) {
    store.dispatch(updateActivity());
  }

  // セッションタイムアウトチェック
  const state = store.getState();
  if (state.auth.isAuthenticated) {
    const lastActivity = new Date(state.auth.lastActivity).getTime();
    const now = new Date().getTime();
    const timeout = state.auth.sessionTimeout || 30 * 60 * 1000;

    if (now - lastActivity > timeout) {
      store.dispatch(logout());
      store.dispatch(addToast({
        type: 'warning',
        title: 'セッション終了',
        message: '非活性時間が長いため、自動ログアウトしました。',
      }));
    }
  }

  return result;
};

// ローカルストレージミドルウェア
export const localStorageMiddleware: Middleware<{}, any> = (store) => (next) => (action: any) => {
  const result = next(action);

  // 認証情報の永続化
  if (action.type === 'auth/loginAsync/fulfilled') {
    const state = store.getState();
    localStorage.setItem('authToken', state.auth.token || '');
    localStorage.setItem('currentUser', JSON.stringify(state.auth.user));
  }

  if (action.type === 'auth/logout') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  return result;
};

// エラーハンドリングミドルウェア
export const errorHandlingMiddleware: Middleware<{}, any> = (store) => (next) => (action: any) => {
  const result = next(action);

  // rejected アクションの処理
  if (action.type && action.type.endsWith('/rejected') && !action.type.includes('auth')) {
    store.dispatch(addToast({
      type: 'error',
      title: 'エラーが発生しました',
      message: action.error?.message || '不明なエラーが発生しました。',
    }));
  }

  return result;
};