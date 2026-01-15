# 開発ステージ
FROM node:24-alpine AS development

# タイムゾーン設定のためのパッケージをインストール
RUN apk add --no-cache tzdata
RUN npm install -g @angular/cli@21

# 作業ディレクトリを設定
USER node
WORKDIR /app

# ポート4200を公開
EXPOSE 4200

# 起動コマンド（コンテナ起動時にnpm installを実行してから開発サーバーを起動）
CMD ["sh", "-c", "npm install && npm start"]