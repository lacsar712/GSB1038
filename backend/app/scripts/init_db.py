"""
数据库初始化脚本
Database initialization script with seed data
"""
import sys
import logging
from pathlib import Path

# 添加父目录到 Python 路径
sys.path.append(str(Path(__file__).parent.parent.parent))

from app.database import engine, Base, SessionLocal
from app.models.user import User

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def init_database():
    """
    初始化数据库
    - 创建所有表
    - 插入演示数据（包含中文）
    """
    logger.info("开始初始化数据库...")
    
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    logger.info("数据库表创建成功")
    
    # 创建会话
    db = SessionLocal()
    
    try:
        # 检查是否已有数据
        existing_users = db.query(User).count()
        if existing_users > 0:
            logger.info(f"数据库已有 {existing_users} 条记录，跳过初始化")
            return
        
        # 插入演示数据
        demo_users = [
            User(
                username="admin",
                password="123456",
                name="张三",
                department="管理部",
                position="总经理",
                phone="13800138000",
                email="zhangsan@family.com"
            ),
            User(
                username="lisi",
                password="123456",
                name="李四",
                department="财务部",
                position="财务总监",
                phone="13800138001",
                email="lisi@family.com"
            ),
            User(
                username="wangwu",
                password="123456",
                name="王五",
                department="人力资源部",
                position="人事经理",
                phone="13800138002",
                email="wangwu@family.com"
            ),
            User(
                username="zhaoliu",
                password="123456",
                name="赵六",
                department="市场部",
                position="市场总监",
                phone="13800138003",
                email="zhaoliu@family.com"
            ),
            User(
                username="sunqi",
                password="123456",
                name="孙七",
                department="技术部",
                position="技术总监",
                phone="13800138004",
                email="sunqi@family.com"
            ),
        ]
        
        db.add_all(demo_users)
        db.commit()
        
        logger.info(f"成功插入 {len(demo_users)} 条演示数据")
        logger.info("数据库初始化完成！")
        
        # 显示插入的数据
        for user in demo_users:
            logger.info(f"  - {user.name} ({user.department} - {user.position})")
        
    except Exception as e:
        logger.error(f"数据库初始化失败: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_database()
