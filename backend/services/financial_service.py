from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, and_
from ..models import FinancialRecord
from ..schemas import FinancialRecordCreate, FinancialRecordUpdate
from fastapi import HTTPException, status
from decimal import Decimal
from datetime import datetime


class FinancialRecordService:
    """Service for financial record operations"""

    @staticmethod
    async def create_record(db: AsyncSession, user_id: int, record: FinancialRecordCreate) -> FinancialRecord:
        """Create a new financial record"""
        db_record = FinancialRecord(
            user_id=user_id,
            amount=record.amount,
            type=record.type,
            category=record.category,
            date=record.date,
            description=record.description
        )
        db.add(db_record)
        await db.commit()
        await db.refresh(db_record)
        return db_record

    @staticmethod
    async def get_record_by_id(db: AsyncSession, record_id: int) -> FinancialRecord:
        """Get a specific financial record by ID"""
        query = select(FinancialRecord).filter(FinancialRecord.id == record_id)
        result = await db.execute(query)
        record = result.scalar_one_or_none()
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Record not found"
            )
        return record

    @staticmethod
    async def get_user_records(
        db: AsyncSession,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        record_type: str = None,
        category: str = None,
        start_date: str = None,
        end_date: str = None
    ) -> tuple[list[FinancialRecord], int]:
        """Get records for a specific user with filters"""
        query = select(FinancialRecord).filter(FinancialRecord.user_id == user_id)
        
        if record_type:
            query = query.filter(FinancialRecord.type == record_type)
        if category:
            query = query.filter(FinancialRecord.category == category)
        if start_date:
            query = query.filter(FinancialRecord.date >= start_date)
        if end_date:
            query = query.filter(FinancialRecord.date <= end_date)
        
        # Get total count
        count_query = select(func.count(FinancialRecord.id)).filter(FinancialRecord.user_id == user_id)
        if record_type:
            count_query = count_query.filter(FinancialRecord.type == record_type)
        if category:
            count_query = count_query.filter(FinancialRecord.category == category)
        if start_date:
            count_query = count_query.filter(FinancialRecord.date >= start_date)
        if end_date:
            count_query = count_query.filter(FinancialRecord.date <= end_date)
        
        count_result = await db.execute(count_query)
        total_count = count_result.scalar()
        
        query = query.order_by(FinancialRecord.date.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all(), total_count

    @staticmethod
    async def get_all_records(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        record_type: str = None,
        category: str = None,
        start_date: str = None,
        end_date: str = None
    ) -> tuple[list[FinancialRecord], int]:
        """Get all records from all users (for analysts and admins)"""
        query = select(FinancialRecord)
        
        if record_type:
            query = query.filter(FinancialRecord.type == record_type)
        if category:
            query = query.filter(FinancialRecord.category == category)
        if start_date:
            query = query.filter(FinancialRecord.date >= start_date)
        if end_date:
            query = query.filter(FinancialRecord.date <= end_date)
        
        # Get total count
        count_query = select(func.count(FinancialRecord.id))
        if record_type:
            count_query = count_query.filter(FinancialRecord.type == record_type)
        if category:
            count_query = count_query.filter(FinancialRecord.category == category)
        if start_date:
            count_query = count_query.filter(FinancialRecord.date >= start_date)
        if end_date:
            count_query = count_query.filter(FinancialRecord.date <= end_date)
        
        count_result = await db.execute(count_query)
        total_count = count_result.scalar()
        
        query = query.order_by(FinancialRecord.date.desc()).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all(), total_count

    @staticmethod
    async def update_record(db: AsyncSession, record_id: int, user_id: int, record_update: FinancialRecordUpdate) -> FinancialRecord:
        """Update a financial record"""
        db_record = await FinancialRecordService.get_record_by_id(db, record_id)
        
        update_data = record_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_record, field, value)
        
        await db.commit()
        await db.refresh(db_record)
        return db_record

    @staticmethod
    async def delete_record(db: AsyncSession, record_id: int, user_id: int) -> bool:
        """Delete a financial record"""
        db_record = await FinancialRecordService.get_record_by_id(db, record_id)
        await db.delete(db_record)
        await db.commit()
        return True

    @staticmethod
    async def get_user_summary(db: AsyncSession, user_id: int) -> dict:
        """Get financial summary for a user"""
        # Total income
        income_query = select(func.sum(FinancialRecord.amount)).filter(
            FinancialRecord.type == 'income',
            FinancialRecord.user_id == user_id
        )
        income_result = await db.execute(income_query)
        total_income = income_result.scalar() or Decimal('0.00')
        
        # Total expense
        expense_query = select(func.sum(FinancialRecord.amount)).filter(
            FinancialRecord.type == 'expense',
            FinancialRecord.user_id == user_id
        )
        expense_result = await db.execute(expense_query)
        total_expense = expense_result.scalar() or Decimal('0.00')
        
        # Category breakdown
        category_query = select(
            FinancialRecord.category,
            func.sum(FinancialRecord.amount),
            func.count(FinancialRecord.id)
        ).filter(
            FinancialRecord.user_id == user_id
        ).group_by(FinancialRecord.category)
        
        category_result = await db.execute(category_query)
        categories = [
            {
                'category': row[0],
                'total_amount': row[1],
                'count': row[2]
            }
            for row in category_result.all()
        ]
        
        # Recent records
        recent_query = select(FinancialRecord).filter(
            FinancialRecord.user_id == user_id
        ).order_by(FinancialRecord.date.desc()).limit(5)
        
        recent_result = await db.execute(recent_query)
        recent_records = recent_result.scalars().all()
        
        # Record count
        count_query = select(func.count(FinancialRecord.id)).filter(
            FinancialRecord.user_id == user_id
        )
        count_result = await db.execute(count_query)
        record_count = count_result.scalar()
        
        return {
            'total_income': total_income,
            'total_expense': total_expense,
            'net_balance': total_income - total_expense,
            'category_breakdown': categories,
            'recent_records': recent_records,
            'record_count': record_count
        }

    @staticmethod
    async def get_organization_summary(db: AsyncSession) -> dict:
        """Get financial summary for entire organization (for analysts and admins)"""
        # Total income across organization
        income_query = select(func.sum(FinancialRecord.amount)).filter(
            FinancialRecord.type == 'income'
        )
        income_result = await db.execute(income_query)
        total_income = income_result.scalar() or Decimal('0.00')
        
        # Total expense across organization
        expense_query = select(func.sum(FinancialRecord.amount)).filter(
            FinancialRecord.type == 'expense'
        )
        expense_result = await db.execute(expense_query)
        total_expense = expense_result.scalar() or Decimal('0.00')
        
        # Category breakdown across organization
        category_query = select(
            FinancialRecord.category,
            func.sum(FinancialRecord.amount),
            func.count(FinancialRecord.id)
        ).group_by(FinancialRecord.category)
        
        category_result = await db.execute(category_query)
        categories = [
            {
                'category': row[0],
                'total_amount': row[1],
                'count': row[2]
            }
            for row in category_result.all()
        ]
        
        # Recent records across organization
        recent_query = select(FinancialRecord).order_by(FinancialRecord.date.desc()).limit(5)
        
        recent_result = await db.execute(recent_query)
        recent_records = recent_result.scalars().all()
        
        # Record count
        count_query = select(func.count(FinancialRecord.id))
        count_result = await db.execute(count_query)
        record_count = count_result.scalar()
        
        return {
            'total_income': total_income,
            'total_expense': total_expense,
            'net_balance': total_income - total_expense,
            'category_breakdown': categories,
            'recent_records': recent_records,
            'record_count': record_count
        }
