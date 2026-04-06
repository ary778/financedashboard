from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from ..models import User, Role
from ..schemas import UserCreate, UserUpdate
import hashlib
from fastapi import HTTPException, status


class UserService:
    """Service for user-related operations"""

    @staticmethod
    async def create_user(db: AsyncSession, user: UserCreate) -> User:
        """Create a new user with hashed password"""
        try:
            # Check if role exists
            role_query = select(Role).filter(Role.id == user.role_id)
            result = await db.execute(role_query)
            if not result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Role not found"
                )
            
            # Hash password
            hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
            
            db_user = User(
                name=user.name,
                email=user.email,
                password=hashed_password,
                role_id=user.role_id,
                is_active=1
            )
            db.add(db_user)
            await db.commit()
            await db.refresh(db_user)
            return db_user
        except IntegrityError:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already exists"
            )

    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> User:
        """Get user by ID"""
        query = select(User).filter(User.id == user_id)
        result = await db.execute(query)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user

    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> User:
        """Get user by email"""
        query = select(User).filter(User.email == email)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_all_users(db: AsyncSession, skip: int = 0, limit: int = 100) -> list[User]:
        """Get all users with pagination"""
        query = select(User).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    @staticmethod
    async def update_user(db: AsyncSession, user_id: int, user_update: UserUpdate) -> User:
        """Update user information"""
        db_user = await UserService.get_user_by_id(db, user_id)
        
        update_data = user_update.dict(exclude_unset=True)
        
        if 'role_id' in update_data:
            role_query = select(Role).filter(Role.id == update_data['role_id'])
            result = await db.execute(role_query)
            if not result.scalar_one_or_none():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Role not found"
                )
        
        try:
            for field, value in update_data.items():
                setattr(db_user, field, value)
            await db.commit()
            await db.refresh(db_user)
            return db_user
        except IntegrityError:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username or email already exists"
            )

    @staticmethod
    async def delete_user(db: AsyncSession, user_id: int) -> bool:
        """Soft delete a user (mark as inactive)"""
        db_user = await UserService.get_user_by_id(db, user_id)
        db_user.is_active = 0
        await db.commit()
        return True

    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> User:
        """Authenticate a user by email and password"""
        user = await UserService.get_user_by_email(db, email)
        if not user or user.is_active == 0:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        if user.password != hashed_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        return user
