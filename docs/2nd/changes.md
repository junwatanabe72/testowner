# 2nd 実装メモ（セレクタのメモ化＋型付きフック適用）

## 目的
- 派生データ（占有率・各種フィルタ）の再計算を抑え、再レンダーを削減する。
- `useAppSelector`/`useAppDispatch` の適用範囲を拡大し、`RootState` 注釈や `any` 依存を減らす。

## 変更概要
- 変更: `src/store/selectors.ts`
  - `createSelector` によるメモ化を追加（`selectOccupancyRate`、`selectVacantFloors`、`selectOccupiedFloors`、`selectPendingApplications`、`selectPendingViewings`、`selectRecentActivities`）。
- 変更: 主要コンポーネントのフック置換
  - `components/Layout/Header.tsx`, `components/Layout/Navigation.tsx`
  - `features/broker/pages/ViewingReservation.tsx`（既に対応済の一部を含む）
  - 影響の大きい箇所から順次適用（残件は次ステップ）。

## 動作確認
1. 画面遷移（オーナー/ブローカー各ページ）で動作・表示確認
2. `npm run build` が成功することを確認

## 次の候補
- listenerMiddleware による永続化条件の明示化
- DataTable のジェネリクス対応・安定キー化
- ルーティングのコード分割（React.lazy）
