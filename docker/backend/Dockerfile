# 開発ステージ
FROM node:22-alpine AS development

# タイムゾーン設定のためのパッケージをインストール
RUN apk add --no-cache tzdata

# 作業ディレクトリを設定
WORKDIR /app

# ポート3000（アプリケーション）と9229（デバッグ）を公開
EXPOSE 3000 9229

# 起動コマンド（コンテナ起動時にnpm installを実行してから開発サーバーを起動）
CMD ["sh", "-c", "npm install && npm run start:dev"]
