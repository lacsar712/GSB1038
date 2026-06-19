#!/bin/bash
# 数据库初始化和应用启动脚本

echo "等待数据库启动..."
sleep 10

echo "初始化数据库..."
python -m app.scripts.init_db

echo "启动 FastAPI 应用..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
