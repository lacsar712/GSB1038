# 多阶段构建 - Python FastAPI Backend
FROM python:3.11-slim AS builder

WORKDIR /app

# 配置 pip 阿里云镜像加速
RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/ && \
    pip config set global.trusted-host mirrors.aliyun.com

# 安装 uv
RUN pip install --no-cache-dir uv

# 复制依赖文件
COPY pyproject.toml .

# 使用 uv 安装依赖，增加超时时间
ENV UV_HTTP_TIMEOUT=300
RUN uv pip install --system -r pyproject.toml

# 生产阶段
FROM python:3.11-slim

WORKDIR /app

# 配置 Debian 阿里云镜像源
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources 2>/dev/null || \
    echo "deb https://mirrors.aliyun.com/debian/ bookworm main contrib non-free" > /etc/apt/sources.list && \
    echo "deb https://mirrors.aliyun.com/debian/ bookworm-updates main contrib non-free" >> /etc/apt/sources.list

# 从构建阶段复制已安装的依赖
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# 复制应用代码
COPY . .

# 安装 curl 用于健康检查
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 暴露端口
EXPOSE 8000

# 启动命令 - 直接使用 bash 执行
CMD ["bash", "-c", "echo '等待数据库启动...' && sleep 10 && echo '初始化数据库...' &&  python -m app.scripts.init_db && echo '启动 FastAPI 应用...' && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
