"""
认证模块 Schema
Authentication module schemas - independent from other modules
"""
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    """登录请求 Schema"""
    username: str = Field(..., min_length=1, max_length=50, description="用户名")
    password: str = Field(..., min_length=1, description="密码")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "username": "admin",
                    "password": "123456"
                }
            ]
        }
    }


class LoginResponse(BaseModel):
    """登录响应 Schema"""
    id: int
    username: str
    name: str
    department: str | None = None
    position: str | None = None
    
    model_config = {
        "from_attributes": True
    }


class MessageResponse(BaseModel):
    """通用消息响应"""
    message: str
