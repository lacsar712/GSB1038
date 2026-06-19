"""
认证路由模块
Authentication router - handles login
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["认证"])


@router.post("/login", response_model=LoginResponse, summary="用户登录")
async def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    用户登录接口
    
    - **username**: 用户名
    - **password**: 密码
    - 返回用户基本信息
    """
    logger.info(f"登录请求: username={request.username}")
    
    # 查询用户
    user = db.query(User).filter(User.username == request.username).first()
    
    if not user:
        logger.warning(f"用户不存在: {request.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )
    
    # 验证密码 (此处简化处理，实际应使用加密)
    if user.password != request.password:
        logger.warning(f"密码错误: username={request.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )
    
    logger.info(f"登录成功: user_id={user.id}, username={user.username}")
    
    return LoginResponse.model_validate(user)
