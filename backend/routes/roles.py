from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from ..base import get_db
from ..schemas import RoleCreate, RoleResponse, RoleUpdate
from ..services.role_service import RoleService
from .dependencies import verify_admin

router = APIRouter(prefix="/api/roles", tags=["roles"])


@router.post("", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
async def create_role(
    role: RoleCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(verify_admin)
):
    """Create a new role (Admin only)"""
    return await RoleService.create_role(db, role)


@router.get("/{role_id}", response_model=RoleResponse)
async def get_role(
    role_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(verify_admin)
):
    """Get a specific role (Admin only)"""
    return await RoleService.get_role_by_id(db, role_id)


@router.get("", response_model=list[RoleResponse])
async def get_all_roles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(verify_admin)
):
    """Get all roles (Admin only)"""
    return await RoleService.get_all_roles(db, skip, limit)


@router.put("/{role_id}", response_model=RoleResponse)
async def update_role(
    role_id: int,
    role_update: RoleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(verify_admin)
):
    """Update a role (Admin only)"""
    return await RoleService.update_role(db, role_id, role_update)


@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_role(
    role_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(verify_admin)
):
    """Delete a role (Admin only)"""
    await RoleService.delete_role(db, role_id)
    return None
