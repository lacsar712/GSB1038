"""
FastAPI 主应用
Main FastAPI application with CORS and logging
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import sys
from sqlalchemy import text

from app.database import engine
from app.routers import auth, contact

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

# 创建 FastAPI 应用
app = FastAPI(
    title="家族公司通讯录 API",
    description="Family Company Contact Management System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载路由
app.include_router(auth.router)
app.include_router(contact.router)

logger.info("FastAPI 应用启动成功")


@app.get("/", tags=["健康检查"])
async def root():
    return {
        "message": "家族公司通讯录 API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health", tags=["健康检查"])
async def health_check():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
