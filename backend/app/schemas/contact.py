"""
通讯录模块 Schema
Contact module schemas - independent from auth module
"""
from pydantic import BaseModel, Field, EmailStr
from datetime import datetime


class ContactBase(BaseModel):
    """通讯录基础 Schema"""
    name: str = Field(..., min_length=1, max_length=50, description="姓名")
    department: str | None = Field(None, max_length=100, description="部门")
    position: str | None = Field(None, max_length=100, description="职位")
    phone: str | None = Field(None, max_length=20, description="电话")
    email: str | None = Field(None, max_length=100, description="邮箱")


class ContactCreate(ContactBase):
    """创建通讯录 Schema"""
    username: str = Field(..., min_length=1, max_length=50, description="用户名")
    password: str = Field(..., min_length=1, description="密码")


class ContactUpdate(ContactBase):
    """更新通讯录 Schema"""
    name: str | None = Field(None, min_length=1, max_length=50, description="姓名")


class ContactResponse(ContactBase):
    """通讯录响应 Schema"""
    id: int
    username: str
    create_time: datetime
    
    model_config = {
        "from_attributes": True
    }
