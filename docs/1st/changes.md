# 1st 実装メモ（LocalStorage統一＋型強化）

## 目的
- LocalStorage キーの不一致を解消し、データのエクスポート/インポート/リセットを機能させる。
- Store 型を厳密化し、型付きフックを導入して `any` 利用を減らす。

## 変更概要
- 追加: `src/constants/storage.ts`
  - `STORAGE_KEY = 'building-management-poc'` を定義（現行の永続化ミドルウェアに合わせて統一）。
- 変更: `src/store/middleware.ts`
  - 直書きのキーを `STORAGE_KEY` 参照に変更。
- 変更: `src/components/Common/DataManagement.tsx`
  - エクスポート/インポート/リセット/情報取得時のキーを `STORAGE_KEY` に統一。
- 追加: `src/store/hooks.ts`
  - `useAppDispatch` / `useAppSelector` の型付きフックを追加。
- 変更: 一部コンポーネントで型付きフックを採用
  - `components/Common/Notification.tsx`
  - `components/Common/DataManagement.tsx`
  - `pages/RoleSelection.tsx`
- 変更: `src/store/index.ts`
  - `combineReducers` + `PreloadedState` を用い、`as any` を削減。

## 影響範囲
- アプリの既存データは LocalStorage キー `building-management-poc` に保存・取得されます。
- 既に `building-saas-data` に保存済みのデータは読み込まれません（必要なら移行スクリプトを別途検討）。

## 動作確認手順
1. アプリ起動 → 画面操作（申請追加・内見予約など）
2. `オーナー > データ管理` よりエクスポート/インポート/リセットの動作確認
3. ブラウザの開発者ツールで LocalStorage のキー `building-management-poc` を確認

## 次の候補
- listenerMiddleware による永続トリガの明示化
- セレクタのメモ化（reselect）
- DataTable のジェネリクス対応・安定キー
- ルートのコード分割（React.lazy）

