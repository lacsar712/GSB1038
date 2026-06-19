"""
用户数据模型
User data model for authentication and contacts
"""
from sqlalchemy import Column, Integer, String, DateTime, func
from app.database import Base


class User(Base):
    """
    用户表模型
    User table model - stores both auth info and contact details
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True, comment="登录用户名")
    password = Column(String(255), nullable=False, comment="密码")
    name = Column(String(50), nullable=False, comment="真实姓名")
    department = Column(String(100), nullable=True, comment="部门")
    position = Column(String(100), nullable=True, comment="职位")
    phone = Column(String(20), nullable=True, comment="电话")
    email = Column(String(100), nullable=True, comment="邮箱")
    create_time = Column(DateTime, server_default=func.now(), comment="创建时间")
    
    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, name={self.name})>"
