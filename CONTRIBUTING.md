# コントリビューションガイド

TANEプロジェクトへのコントリビューションに興味を持っていただき、ありがとうございます！

## 行動規範

このプロジェクトに参加するすべての人は、敬意を持って接することが期待されます。

## コントリビューション方法

### イシューの報告

バグを見つけた場合や新機能を提案したい場合は、[イシュー](https://github.com/your-username/your-project-name/issues)を作成してください。

- **バグ報告**: バグ報告テンプレートを使用してください
- **機能リクエスト**: 機能リクエストテンプレートを使用してください

### プルリクエストの作成

1. **フォークとクローン**

```bash
# リポジトリをフォーク
# フォークしたリポジトリをクローン
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
```

2. **ブランチを作成**

```bash
git checkout -b feature/your-feature-name
```

ブランチ名の規約：
- `feature/` - 新機能
- `fix/` - バグ修正
- `docs/` - ドキュメント更新
- `refactor/` - リファクタリング
- `test/` - テスト追加

3. **変更を加える**

コーディング規約に従って変更を加えてください。

4. **テストを実行**

```bash
# バックエンドのテスト
docker compose exec backend npm test

# Lintチェック
docker compose exec backend npm run lint
docker compose exec frontend npm run lint

# 型チェック
docker compose exec backend npx tsc --noEmit
docker compose exec frontend npx tsc --noEmit
```

5. **コミット**

```bash
git add .
git commit -m "feat: 新機能の説明"
```

コミットメッセージの規約：
- `feat:` - 新機能
- `fix:` - バグ修正
- `docs:` - ドキュメント更新
- `style:` - コードスタイルの変更
- `refactor:` - リファクタリング
- `test:` - テスト追加
- `chore:` - ビルドプロセスやツールの変更

6. **プッシュ**

```bash
git push origin feature/your-feature-name
```

7. **プルリクエストを作成**

GitHubでプルリクエストを作成してください。プルリクエストテンプレートに従って記入してください。

## コーディング規約

### TypeScript

- **型定義**: すべての変数、関数、クラスに型を明示的に定義する
- **命名規則**:
  - 変数・関数: camelCase
  - クラス・インターフェース: PascalCase
  - 定数: UPPER_SNAKE_CASE
- **インデント**: 2スペース

### Angular

- **Signals**: 状態管理にはSignalsを使用する
- **Zoneless**: Zone.jsを使用しない
- **Standalone Components**: すべてのコンポーネントはstandaloneにする
- **新しい制御フロー**: `@if`, `@for`, `@switch`を使用する

### NestJS

- **モジュール**: 機能ごとにモジュールを分割する
- **依存性注入**: コンストラクタインジェクションを使用する
- **Swagger**: すべてのエンドポイントにSwaggerデコレーターを追加する
- **バリデーション**: DTOにclass-validatorを使用する

### コメント

- **日本語**: コメントは日本語で記述する
- **JSDoc**: 公開APIには必ずJSDocを記述する

## テスト

### 単体テスト

- すべての新機能にはテストを追加する
- テストカバレッジは80%以上を目指す

### 統合テスト

- APIエンドポイントには統合テストを追加する

## ドキュメント

- 新機能を追加した場合は、ドキュメントも更新する
- README.mdに記載が必要な場合は更新する

## レビュープロセス

1. プルリクエストを作成すると、自動的にCIが実行されます
2. すべてのチェックが通ることを確認してください
3. メンテナーがレビューします
4. 必要に応じて修正を依頼します
5. 承認されたらマージされます

## 質問

質問がある場合は、[イシュー](https://github.com/your-username/your-project-name/issues)を作成するか、[ディスカッション](https://github.com/your-username/your-project-name/discussions)で質問してください。

## ライセンス

コントリビューションすることで、あなたの貢献がMITライセンスの下でライセンスされることに同意したものとみなされます。
