# 開発ステージ
FROM node:22-alpine AS development

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存パッケージをインストール
RUN npm install

# ソースコードをコピー
COPY . .

# ポート4200を公開
EXPOSE 4200

# 起動コマンド
CMD ["npm", "start"]
