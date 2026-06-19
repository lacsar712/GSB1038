# 多阶段构建 - Python FastAPI Backend
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim AS builder

WORKDIR /app

ENV UV_COMPILE_BYTECODE=1
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN python -m venv $VIRTUAL_ENV

COPY pyproject.toml .

RUN uv sync --no-dev --no-install-workspace

FROM python:3.11-slim

WORKDIR /app

ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources 2>/dev/null || \
    echo "deb https://mirrors.aliyun.com/debian/ bookworm main contrib non-free" > /etc/apt/sources.list && \
    echo "deb https://mirrors.aliyun.com/debian/ bookworm-updates main contrib non-free" >> /etc/apt/sources.list

COPY --from=builder $VIRTUAL_ENV $VIRTUAL_ENV

COPY . .

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

EXPOSE 8000

CMD ["bash", "-c", "echo '初始化数据库...' && python -m app.scripts.init_db && echo '启动 FastAPI 应用...' && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
