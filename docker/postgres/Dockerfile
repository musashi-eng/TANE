FROM postgres:17

# 日本語ロケールのインストール
RUN apt-get update && \
    apt-get install -y locales && \
    sed -i -e 's/# ja_JP.UTF-8 UTF-8/ja_JP.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ロケール環境変数の設定
ENV LANG=ja_JP.UTF-8
ENV LC_ALL=ja_JP.UTF-8
