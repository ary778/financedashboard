from fastapi import HTTPException, status, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from ..base import get_db
from ..models import User, Role
from ..services.user_service import UserService
from typing import Optional

# Role IDs (these should match your database)
ROLE_VIEWER = 1
ROLE_ANALYST = 2
ROLE_ADMIN = 3

# This is a mock for testing - in production use JWT
CURRENT_USER_HEADER = "X-User-ID"


async def get_current_user(
    x_user_id: Optional[int] = Header(None, alias=CURRENT_USER_HEADER),
    db: AsyncSession = Depends(get_db)
) -> User:
    """Get current authenticated user from header"""
    if not x_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await UserService.get_user_by_id(db, x_user_id)
    
    if user.is_active == 0:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is inactive"
        )
    
    return user


async def verify_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Verify user is admin (Admin only)"""
    if current_user.role_id != ROLE_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


async def verify_analyst_or_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """Verify user is analyst or admin (can create/modify records and view all data)"""
    if current_user.role_id not in [ROLE_ANALYST, ROLE_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Analyst or Admin access required"
        )
    return current_user


async def verify_not_viewer(
    current_user: User = Depends(get_current_user)
) -> User:
    """Verify user is not a viewer (Analyst or Admin)"""
    if current_user.role_id == ROLE_VIEWER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Viewers cannot perform this action"
        )
    return current_user


async def verify_viewer_or_higher(
    current_user: User = Depends(get_current_user)
) -> User:
    """All authenticated users are viewers or higher"""
    return current_user
