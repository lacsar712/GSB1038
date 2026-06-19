# 多阶段构建 - Python FastAPI Backend
# 构建阶段：使用官方 uv 镜像，仅通过 `uv sync` 安装依赖，禁止使用 pip / requirements.txt
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim AS builder

WORKDIR /app

# uv 配置：使用阿里云镜像加速、国内网络下放宽超时、并将虚拟环境固定在项目目录
ENV UV_HTTP_TIMEOUT=300 \
    UV_INDEX_URL=https://mirrors.aliyun.com/pypi/simple/ \
    UV_PROJECT_ENVIRONMENT=/app/.venv \
    UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1

# 仅复制依赖声明文件，最大化利用构建缓存
COPY pyproject.toml ./
COPY uv.loc[k] ./

# 使用 uv sync 安装依赖（不安装当前项目本体，仅同步依赖）
RUN uv sync --no-install-project --no-dev

# 生产阶段
FROM python:3.11-slim AS runtime

WORKDIR /app

# 配置 Debian 阿里云镜像源并安装 curl（用于 healthcheck）
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources 2>/dev/null || \
    (echo "deb https://mirrors.aliyun.com/debian/ bookworm main contrib non-free" > /etc/apt/sources.list && \
     echo "deb https://mirrors.aliyun.com/debian/ bookworm-updates main contrib non-free" >> /etc/apt/sources.list) && \
    apt-get update && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# 从构建阶段复制 uv 同步生成的虚拟环境
COPY --from=builder /app/.venv /app/.venv

# 将虚拟环境加入 PATH，使 uvicorn / python 默认走 .venv
ENV PATH="/app/.venv/bin:$PATH" \
    VIRTUAL_ENV="/app/.venv" \
    PYTHONUNBUFFERED=1

# 复制应用代码
COPY . .

EXPOSE 8000

# 启动命令：等待 db healthy 由 compose 保证，这里只负责初始化与启动
CMD ["bash", "-c", "echo '初始化数据库...' && python -m app.scripts.init_db && echo '启动 FastAPI 应用...' && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
