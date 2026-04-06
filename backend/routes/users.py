from fastapi import APIRouter, Depends, status, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..base import get_db
from ..schemas import UserResponse, UserUpdate, UserCreate
from ..services.user_service import UserService
from .dependencies import verify_admin, get_current_user, ROLE_ADMIN

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user = Depends(get_current_user)
):
    """Get current user's profile (All authenticated users)"""
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get user by ID (Admin can view any user, others can only view themselves)"""
    # Users can only view themselves unless they're admin
    if current_user.id != user_id and current_user.role_id != ROLE_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot view other users"
        )
    
    user = await UserService.get_user_by_id(db, user_id)
    return user


@router.get("", response_model=list[UserResponse])
async def get_all_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(verify_admin)
):
    """Get all users (Admin only)"""
    return await UserService.get_all_users(db, skip, limit)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(verify_admin)
):
    """Create a new user (Admin only)"""
    return await UserService.create_user(db, user)


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update user information (Users can update themselves, Admins can update anyone)"""
    # Users can only update themselves, admins can update anyone
    if current_user.id != user_id and current_user.role_id != ROLE_ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update other users"
        )
    
    return await UserService.update_user(db, user_id, user_update)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(verify_admin)
):
    """Delete a user - soft delete (Admin only)"""
    await UserService.delete_user(db, user_id)
    return None
