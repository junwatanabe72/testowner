# GitHub Pagesへのデプロイ手順

## 🚀 デプロイ準備完了

すべての設定が完了しました。以下の手順でGitHub Pagesにデプロイできます。

## 📝 デプロイ手順

### 1. 現在の変更をコミット・プッシュ

```bash
# 変更をステージング
git add .

# コミット
git commit -m "Add GitHub Pages deployment configuration"

# mainブランチにプッシュ
git push origin main
```

### 2. GitHub Pagesへデプロイ

```bash
# ビルドとデプロイを実行
npm run deploy
```

このコマンドで以下が自動実行されます：
- プロダクションビルドの作成
- `gh-pages`ブランチの作成/更新
- ビルドファイルのアップロード

### 3. GitHub リポジトリ設定

1. GitHubで`testowner`リポジトリを開く
2. `Settings`タブをクリック
3. 左メニューの`Pages`をクリック
4. 以下を設定：
   - **Source**: `Deploy from a branch`
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. `Save`をクリック

## 🌐 アクセス方法

デプロイ完了後（通常1-5分）、以下のURLでアクセス可能：

**https://junwatanabe72.github.io/testowner**

### 各ページへの直接アクセス

- オーナーダッシュボード: `https://junwatanabe72.github.io/testowner/#/owner`
- 仲介会社ポータル: `https://junwatanabe72.github.io/testowner/#/broker`
- 役割選択画面: `https://junwatanabe72.github.io/testowner/#/`

## ⚠️ 注意事項

1. **初回デプロイ**: 反映まで最大10分かかる場合があります
2. **URL形式**: HashRouterを使用しているため、URLに`#/`が含まれます
3. **データ**: LocalStorageは本番環境では空の状態から始まります
4. **更新**: 今後の更新は`npm run deploy`のみで反映されます

## 🔧 トラブルシューティング

### 404エラーが表示される
- GitHub Pages設定が正しいか確認
- `gh-pages`ブランチが存在するか確認
- 5-10分待ってから再度アクセス

### ページが更新されない
- ブラウザのキャッシュをクリア（Ctrl+F5 または Cmd+Shift+R）
- シークレットモードで確認

### スタイルが崩れる
- ビルドが正常に完了したか確認
- コンソールエラーを確認

## 📊 デプロイ状態の確認

GitHub Actions タブで、デプロイの進行状況を確認できます。
緑のチェックマークが表示されれば、デプロイ成功です。