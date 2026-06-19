"""
数据库配置模块
Database configuration module with SQLAlchemy ORM
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# 数据库连接配置 - 使用 Docker 服务名
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:root@db:3306/contacts_db?charset=utf8mb4"
)

# 创建数据库引擎，配置 utf8mb4 字符集
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False,
    connect_args={
        "charset": "utf8mb4"
    }
)

# 创建会话工厂
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 创建 Base 类
Base = declarative_base()

# 依赖注入：获取数据库会话
def get_db():
    """
    数据库会话依赖注入
    Database session dependency injection
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
