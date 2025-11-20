# 開発ステージ
FROM node:22-alpine AS development

# 作業ディレクトリを設定
WORKDIR /app

# ポート4200を公開
EXPOSE 4200

# 起動コマンド（コンテナ起動時にnpm installを実行してから開発サーバーを起動）
CMD ["sh", "-c", "npm install && npm start"]
