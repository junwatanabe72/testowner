# コードレビュー（testowner）改善提案

## 概要
- 対象: `testowner/` 配下（React + TypeScript + Redux Toolkit + MUI）
- 目的: ビルド互換性・型安全性・状態永続化の一貫性・UX/パフォーマンス・メンテナンス性の改善
- 重要度区分: 高 / 中 / 低 で記載

## 高優先（ブロッカー/不具合リスク）
- 依存関係の非互換（ブート環境）
  - 現状: `react@19` / `react-router-dom@7` / `@mui/material@7` と `react-scripts@5` の組合せ。
  - 懸念: CRA v5 は React 19 を公式サポート外。ビルド/テスト/型周りの不整合が発生しやすい。
  - 提案: Vite への移行を推奨（`vite` + `@vitejs/plugin-react-swc`）。TypeScript を 5.x に更新し、tsconfig のターゲットも見直す。
    - 代替: もし CRA 継続なら、React を 18 系へダウングレードし、依存を整合させる。

- LocalStorage キーの不一致（機能不全の原因）
  - 現状: `src/store/middleware.ts` は `building-management-poc` を使用。一方 `src/components/Common/DataManagement.tsx` は `building-saas-data` を使用。
  - 影響: エクスポート/インポート/リセットが、実際に保存されているデータと噛み合わない。
  - 提案: 共有定数を導入し統一（例: `src/constants/storage.ts` に `export const STORAGE_KEY = '...'`）。両実装で同一キーを参照。

- Redux Store 型定義の `any` 多用
  - 該当: `src/store/index.ts` の `preloadedState`, `middleware` 連結時などに `as any` が散見。
  - 影響: 型安全性低下、リファクタ時の不具合検出が困難。
  - 提案: `RootState`/`AppDispatch` を厳密化し、`configureStore` の戻りから派生。`preloadedState` は `PreloadedState<RootState>` を用いる。

- ミドルウェアの永続化条件が脆弱
  - 該当: `src/store/middleware.ts`
  - 現状: `action.type` の文字列に `add/update/delete/remove/create/initialize` が「含まれるか」で保存をトリガ。
  - 影響: 意図しないアクションもヒット/漏れ。保守性・可読性も低い。
  - 提案: `createListenerMiddleware` + `isAnyOf` で、明示的に関心アクション（各 slice の add/update/remove など）を列挙。もしくは `redux-persist` に切替。

- データ整合性のハードコード（4Fは必ず入居中）
  - 該当: `middleware.ts` の `loadPersistedState`
  - 影響: シードデータに依存した特殊ルールが本番ロジックに混入。運用・テストで予期せぬクリアが発生。
  - 提案: シード専用の検証に移すか、検証はスキーマ（例: Zod）で汎用的に実施し、ビジネスルールは slice 側で運用する。

## 中優先（品質/UX/パフォーマンス）
- 型付きフックの導入
  - 該当: 各コンポーネントで `useSelector((state: any) => ...)` が散見。
  - 提案: `src/store/hooks.ts` に `useAppDispatch`/`useAppSelector` を定義し全面置換。型補完と安全性を向上。

- セレクタのメモ化
  - 該当: `src/store/selectors.ts`
  - 提案: `createSelector`（reselect）でメモ化し、無駄な再レンダーを抑制。計算の重いソート/集計系（占有率など）を対象に。

- DataTable の汎用性と安定キー
  - 該当: `src/components/Common/DataTable.tsx`
  - 現状: `rows: any[]` と `key={index}` を使用。
  - 提案: ジェネリクス化（例: `<T extends { id: string }>`）、`getRowId` props を追加し安定キー使用。大量データ時は仮想化（`@tanstack/react-virtual` 等）も検討。

- ルーティングのコード分割
  - 該当: `src/App.tsx`
  - 提案: `React.lazy` + `Suspense` でページ単位の遅延読み込み。初期ロード時間を短縮。

- import パスの簡素化
  - 現状: 相対パスの多段 `../../../` が散見。
  - 提案: `tsconfig.json` に `baseUrl`/`paths` を設定（Vite なら `vite-tsconfig-paths`）。`@/store` のようなエイリアスに統一。

- テーマ定義の分離
  - 該当: `src/App.tsx` 内で `createTheme`
  - 提案: `src/theme.ts` に切出し。テスト/再利用/切替が容易に。

- ログ出力の制御
  - 該当: `middleware.ts` などで `console.log/console.warn` が常時。
  - 提案: `process.env.NODE_ENV !== 'production'` でガード、またはロガー導入。

- 日付/時刻処理の一貫性
  - 現状: `new Date().toISOString().split('T')[0]` を各所で直書き。
  - 提案: `date-fns` 等のユーティリティに集約（`formatISODate` など）。

## 低優先（保守性/拡張性）
- テストの整備
  - 現状: 依存に Testing Library はあるが、テストコードが見当たらない。
  - 提案: まずは slice（reducer）/selector のユニットテストを追加。移行後は `Vitest`（Vite 前提）推奨。

- Lint/Format の統一
  - 現状: CRA 既定 ESLint のみ。Prettier 設定なし。
  - 提案: ESLint + Prettier の整備、`lint-staged`/`husky` でコミット前チェック。

- i18n 検討
  - 現状: 文言は日本語直書き。
  - 提案: 将来の多言語化に備え、`react-i18next` 等での抽象化を検討。

## 具体ファイル別メモ
- `src/store/index.ts`
  - `preloadedState` の型付け（`PreloadedState<RootState>`）。`generateInitialData` を `RootState` 形状に寄せる。
  - `middleware` は `getDefaultMiddleware().concat(localStorageMiddleware)` で `any` を排除。

- `src/store/middleware.ts`
  - LocalStorage キーを共有定数化。保存対象 slice を明示的に（listenerMiddleware で `isAnyOf(actions...)`）。
  - 4F 固定ロジックは除去。JSON パース/スキーマ検証の例外処理を強化（Zod 等）。

- `src/components/Common/DataManagement.tsx`
  - LocalStorage キー統一・読込/保存関数をユーティリティへ。バリデーション結果に応じて UI 通知を最適化。

- `src/store/selectors.ts`
  - `createSelector` で `selectVacantFloors`/`selectOccupiedFloors`/`selectPendingViewings` をメモ化。

- `src/components/Common/DataTable.tsx`
  - ジェネリクス化、`getRowId` の追加、`key` の安定化。列 `format` の型を `format?<T>(value: T, row: RowType)` に精緻化。

- `src/App.tsx`
  - ルートを `lazy` 化、`ThemeProvider`/`CssBaseline` は維持。エラー境界はルート配下のみに限定しても良い。

## 推奨アップグレード案（Vite 前提）
1. 依存更新（抜粋）
   - `typescript@^5.x`
   - `vite@^5` / `@vitejs/plugin-react-swc`
   - （維持可）`react@19` / `react-router-dom@7` / `@mui/material@7`
2. 設定
   - `tsconfig.json`: `target: ES2020`, `moduleResolution: bundler`, `jsx: react-jsx`
   - パスエイリアス（`baseUrl: src`, `paths: { "@/*": ["*"] }`）
3. テスト
   - `vitest` + `@testing-library/react` へ

## 実施順（例）
1. LocalStorage キー統一（共有定数導入）
2. 型付きフック導入・`any` 除去（Store/Selector 周り）
3. Middleware を listenerMiddleware 化（永続条件の明示化）
4. DataTable のジェネリクス対応と安定キー
5. ルートのコード分割（lazy）
6. Vite への移行（または React 18 へのダウングレード）
7. Lint/Format/テスト整備

---
このドキュメントは改善の俯瞰を目的としています。希望があれば、上記の「実施順」に沿って小さな PR に分けて着手できます（例: まずは LocalStorage キー統一とストア型強化から）。

