from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from ..models import Role
from ..schemas import RoleCreate, RoleUpdate
from fastapi import HTTPException, status


class RoleService:
    """Service for role-related operations"""

    @staticmethod
    async def create_role(db: AsyncSession, role: RoleCreate) -> Role:
        """Create a new role"""
        try:
            db_role = Role(
                name=role.name,
                description=role.description
            )
            db.add(db_role)
            await db.commit()
            await db.refresh(db_role)
            return db_role
        except IntegrityError:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role name already exists"
            )

    @staticmethod
    async def get_role_by_id(db: AsyncSession, role_id: int) -> Role:
        """Get role by ID"""
        query = select(Role).filter(Role.id == role_id)
        result = await db.execute(query)
        role = result.scalar_one_or_none()
        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found"
            )
        return role

    @staticmethod
    async def get_role_by_name(db: AsyncSession, name: str) -> Role:
        """Get role by name"""
        query = select(Role).filter(Role.name == name)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all_roles(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[Role]:
        """Get all roles"""
        query = select(Role).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def update_role(db: AsyncSession, role_id: int, role_update: RoleUpdate) -> Role:
        """Update role information"""
        db_role = await RoleService.get_role_by_id(db, role_id)
        
        update_data = role_update.dict(exclude_unset=True)
        
        try:
            for field, value in update_data.items():
                setattr(db_role, field, value)
            await db.commit()
            await db.refresh(db_role)
            return db_role
        except IntegrityError:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role name already exists"
            )

    @staticmethod
    async def delete_role(db: AsyncSession, role_id: int) -> bool:
        """Delete a role"""
        db_role = await RoleService.get_role_by_id(db, role_id)
        
        # Check if any users have this role
        from sqlalchemy import func
        from ..models import User
        query = select(func.count(User.id)).filter(User.role_id == role_id)
        result = await db.execute(query)
        count = result.scalar()
        
        if count > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete role with associated users"
            )
        
        await db.delete(db_role)
        await db.commit()
        return True
