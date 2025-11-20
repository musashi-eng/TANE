# Tane Frontend

このプロジェクトは[Angular CLI](https://github.com/angular/angular-cli) version 20.0.0で生成されました。

## プロジェクトの特徴

このプロジェクトは、Angular 20の最新機能を採用しています：

- **Zonelessモード**: Zone.jsを使用せず、明示的な変更検知を採用
- **Signalsベース**: 状態管理にSignalsを使用
- **スタンドアロンコンポーネント**: NgModuleを使用しない新しいアーキテクチャ
- **新しい制御フロー構文**: `@if`, `@for`, `@switch`を使用
- **TypeScript 5.8**: 最新のTypeScript機能を活用

詳細なガイドラインについては、`.kiro/steering/angular-guidelines.md`を参照してください。

## 開発サーバー

開発サーバーを起動するには、以下のコマンドを実行してください：

```bash
npm start
```

ブラウザで `http://localhost:4200/` にアクセスしてください。ソースファイルを変更すると、アプリケーションは自動的にリロードされます。

## ビルド

プロジェクトをビルドするには、以下のコマンドを実行してください：

```bash
npm run build
```

ビルド成果物は `dist/` ディレクトリに保存されます。

## テストの実行

単体テストを実行するには、以下のコマンドを実行してください：

```bash
npm test
```

[Karma](https://karma-runner.github.io)を使用してテストを実行します。

## 詳細情報

Angular CLIの詳細については、[Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)を参照してください。
