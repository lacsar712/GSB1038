"""
通讯录路由模块
Contact router - handles CRUD operations for contacts
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse
from app.schemas.auth import MessageResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/contacts", tags=["通讯录"])


@router.get("", response_model=List[ContactResponse], summary="获取通讯录列表")
async def get_contacts(
    skip: int = Query(0, ge=0, description="跳过记录数"),
    limit: int = Query(100, ge=1, le=1000, description="返回记录数"),
    search: str = Query(None, description="搜索关键词"),
    db: Session = Depends(get_db)
):
    """
    获取通讯录列表
    
    - 支持分页
    - 支持搜索（姓名、部门、职位）
    """
    logger.info(f"查询通讯录: skip={skip}, limit={limit}, search={search}")
    
    query = db.query(User)
    
    # 搜索过滤
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (User.name.like(search_filter)) |
            (User.department.like(search_filter)) |
            (User.position.like(search_filter))
        )
    
    contacts = query.offset(skip).limit(limit).all()
    logger.info(f"返回 {len(contacts)} 条通讯录记录")
    
    return [ContactResponse.model_validate(c) for c in contacts]


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED, summary="添加联系人")
async def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db)
):
    """
    添加新联系人
    
    - 用户名不能重复
    """
    logger.info(f"创建联系人: username={contact.username}, name={contact.name}")
    
    # 检查用户名是否已存在
    existing = db.query(User).filter(User.username == contact.username).first()
    if existing:
        logger.warning(f"用户名已存在: {contact.username}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已存在"
        )
    
    # 创建新用户
    new_user = User(**contact.model_dump())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    logger.info(f"成功创建联系人: id={new_user.id}, username={new_user.username}")
    
    return ContactResponse.model_validate(new_user)


@router.put("/{contact_id}", response_model=ContactResponse, summary="更新联系人")
async def update_contact(
    contact_id: int,
    contact: ContactUpdate,
    db: Session = Depends(get_db)
):
    """
    更新联系人信息
    
    - 只更新提供的字段
    """
    logger.info(f"更新联系人: id={contact_id}")
    
    # 查询联系人
    db_contact = db.query(User).filter(User.id == contact_id).first()
    if not db_contact:
        logger.warning(f"联系人不存在: id={contact_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="联系人不存在"
        )
    
    # 更新字段
    update_data = contact.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_contact, field, value)
    
    db.commit()
    db.refresh(db_contact)
    
    logger.info(f"成功更新联系人: id={contact_id}")
    
    return ContactResponse.model_validate(db_contact)


@router.delete("/{contact_id}", response_model=MessageResponse, summary="删除联系人")
async def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db)
):
    """
    删除联系人
    
    - admin 账号不允许删除
    """
    logger.info(f"删除联系人请求: id={contact_id}")
    
    # 查询联系人
    db_contact = db.query(User).filter(User.id == contact_id).first()
    if not db_contact:
        logger.warning(f"联系人不存在: id={contact_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="联系人不存在"
        )
    
    # 保护 admin 账号
    if db_contact.username == "admin":
        logger.warning("尝试删除 admin 账号")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="不允许删除管理员账号"
        )
    
    db.delete(db_contact)
    db.commit()
    
    logger.info(f"成功删除联系人: id={contact_id}, username={db_contact.username}")
    
    return MessageResponse(message=f"成功删除联系人: {db_contact.name}")
