from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..base import get_db
from ..schemas import UserCreate, UserLogin, UserResponse
from ..services.user_service import UserService

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user (defaults to Viewer role)"""
    user.role_id = 1
    return await UserService.create_user(db, user)


@router.post("/login")
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate user and return user info (mock JWT in production)"""
    user = await UserService.authenticate_user(db, credentials.email, credentials.password)
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role_id": user.role_id,
        "message": "Login successful"
    }
