from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from decimal import Decimal
from datetime import datetime

try:
    del BaseModel.__static_attributes__
except AttributeError:
    pass
try:
    del BaseModel.__firstlineno__
except AttributeError:
    pass



# Role Schemas
class RoleBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = None


class RoleCreate(RoleBase):
    pass


class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class RoleResponse(RoleBase):
    id: int

    class Config:
        from_attributes = True


# User Schemas
class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    role_id: int


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    is_active: Optional[int] = None
    role_id: Optional[int] = None


class UserResponse(UserBase):
    id: int
    is_active: int
    created_at: datetime

    class Config:
        from_attributes = True


# Financial Record Schemas
class FinancialRecordBase(BaseModel):
    amount: Decimal = Field(..., decimal_places=2, gt=0)
    type: str = Field(..., pattern="^(income|expense)$")  # Only 'income' or 'expense'
    category: str = Field(..., min_length=1, max_length=50)
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    description: Optional[str] = None


class FinancialRecordCreate(FinancialRecordBase):
    pass


class FinancialRecordUpdate(BaseModel):
    amount: Optional[Decimal] = None
    type: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None


class FinancialRecordResponse(FinancialRecordBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class FinancialRecordListResponse(BaseModel):
    data: list[FinancialRecordResponse]
    total: int
    skip: int
    limit: int


# Dashboard Summary Schemas
class CategorySummary(BaseModel):
    category: str
    total_amount: Decimal
    count: int


class DashboardSummary(BaseModel):
    total_income: Decimal
    total_expense: Decimal
    net_balance: Decimal
    category_breakdown: list[CategorySummary]
    recent_records: list[FinancialRecordResponse]
    record_count: int


# Error Response Schema
class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None


# Export all schemas
__all__ = [
    "RoleBase",
    "RoleCreate",
    "RoleUpdate",
    "RoleResponse",
    "UserBase",
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "UserResponse",
    "FinancialRecordBase",
    "FinancialRecordCreate",
    "FinancialRecordUpdate",
    "FinancialRecordResponse",
    "FinancialRecordListResponse",
    "CategorySummary",
    "DashboardSummary",
    "ErrorResponse",
]
