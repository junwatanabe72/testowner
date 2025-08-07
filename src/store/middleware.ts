import { Middleware, AnyAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'building-management-poc';

export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // 特定のアクション後にLocalStorageに保存
  if (
    (action as any).type?.endsWith('/fulfilled') ||
    (action as any).type?.includes('add') ||
    (action as any).type?.includes('update') ||
    (action as any).type?.includes('delete') ||
    (action as any).type?.includes('remove') ||
    (action as any).type?.includes('create') ||
    (action as any).type?.includes('initialize')
  ) {
    const state = store.getState() as any;
    const dataToStore = {
      building: state.building,
      applications: state.applications,
      viewings: state.viewings,
      activities: state.activities,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  }
  
  return result;
};

// デバッグ用: LocalStorageをクリアして初期データをリセット
export const clearStorageAndReload = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};

// window オブジェクトに関数を追加（開発用）
if (typeof window !== 'undefined') {
  (window as any).clearBuildingStorage = clearStorageAndReload;
}

export const loadPersistedState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    
    // データ整合性チェック: building.dataが存在し、floorsが適切に設定されているか
    if (state.building?.data?.floors) {
      // 4階の状態をチェック - occupiedであるべき
      const floor4 = state.building.data.floors.find((f: any) => f.floorNumber === 4);
      console.log('Floor 4 status from localStorage:', floor4?.status, '| Tenant:', floor4?.tenantName);
      
      if (floor4 && floor4.status !== 'occupied') {
        console.warn('Data integrity issue detected: Floor 4 should be occupied. Clearing localStorage.');
        localStorage.removeItem(STORAGE_KEY);
        return undefined;
      }
      
      // 空室フロアのログ出力
      const vacantFloors = state.building.data.floors.filter((f: any) => f.status === 'vacant');
      console.log('Vacant floors from localStorage:', vacantFloors.map((f: any) => `${f.floorNumber}F`).join(', '));
    }
    
    return state;
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};