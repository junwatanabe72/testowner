# GitHub Pages デプロイ手順

## セットアップ完了項目

✅ package.jsonに`homepage`フィールドを追加
✅ `gh-pages`パッケージをインストール
✅ デプロイスクリプトを追加（`predeploy`と`deploy`）
✅ BrowserRouterからHashRouterに変更（GitHub Pages対応）

## デプロイ方法

1. **現在の変更をコミット**
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

2. **ビルドとデプロイ**
```bash
npm run deploy
```

このコマンドは以下を実行します：
- `npm run build`でプロダクションビルドを作成
- `gh-pages`ブランチを作成/更新
- ビルドファイルをGitHub Pagesにデプロイ

3. **GitHub設定を確認**
- GitHubリポジトリの`Settings` → `Pages`へ移動
- Source: `Deploy from a branch`
- Branch: `gh-pages` / `/ (root)`
- 保存

## アクセスURL

デプロイ完了後、以下のURLでアクセス可能：
https://junwatanabe72.github.io/testowner

## 注意事項

- 初回デプロイ時は反映まで数分かかる場合があります
- URLパスは`#/`で始まります（例：`https://junwatanabe72.github.io/testowner/#/owner`）
- LocalStorageのデータはドメインごとに保存されるため、本番環境では初期状態から始まります

## トラブルシューティング

### 404エラーが表示される場合
- GitHub Pagesの設定を確認
- `gh-pages`ブランチが作成されているか確認
- 数分待ってから再度アクセス

### ルーティングが機能しない場合
- HashRouterが正しく設定されているか確認
- URLに`#/`が含まれているか確認

### スタイルが崩れる場合
- ビルド時のパスが正しいか確認
- `homepage`フィールドが正しく設定されているか確認