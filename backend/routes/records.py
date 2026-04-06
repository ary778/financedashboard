from fastapi import APIRouter, Depends, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import io
import csv
from ..base import get_db
from ..models import FinancialRecord
from ..schemas import FinancialRecordCreate, FinancialRecordResponse, FinancialRecordUpdate, FinancialRecordListResponse
from ..services.financial_service import FinancialRecordService
from .dependencies import get_current_user, verify_admin, verify_analyst_or_admin, ROLE_ANALYST, ROLE_ADMIN

router = APIRouter(prefix="/api/records", tags=["financial_records"])


@router.post("", response_model=FinancialRecordResponse, status_code=status.HTTP_201_CREATED)
async def create_record(
    record: FinancialRecordCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(verify_admin)
):
    """Create a new financial record (Admin only)"""
    return await FinancialRecordService.create_record(db, current_user.id, record)


@router.get("/export")
async def export_csv(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Export financial records to CSV (All authenticated users)"""
    # Determine which records to export based on role
    if current_user.role_id in [ROLE_ANALYST, ROLE_ADMIN]:
        # Analysts and Admins can export all records
        query = select(FinancialRecord).order_by(FinancialRecord.date.desc())
    else:
        # Viewers can only export their own records (but they can't create/edit them)
        query = select(FinancialRecord).filter(FinancialRecord.user_id == current_user.id).order_by(FinancialRecord.date.desc())
    
    result = await db.execute(query)
    records = result.scalars().all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Date", "Type", "Category", "Amount", "Description", "User ID"])
    for r in records:
        writer.writerow([r.id, r.date, r.type, r.category, float(r.amount), r.description or "", r.user_id])
        
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=financial_records.csv"}
    )


@router.get("/{record_id}", response_model=FinancialRecordResponse)
async def get_record(
    record_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific financial record (Analysts and Admins only)"""
    current_user = await verify_analyst_or_admin(current_user)
    return await FinancialRecordService.get_record_by_id(db, record_id)


@router.get("", response_model=FinancialRecordListResponse)
async def get_user_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    record_type: str = Query(None, pattern="^(income|expense)$"),
    category: str = Query(None),
    start_date: str = Query(None),
    end_date: str = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get financial records with filters (Analysts and Admins can see all records, Viewers cannot access)"""
    # Only analysts and admins can view records
    current_user = await verify_analyst_or_admin(current_user)
    
    # All analysts and admins see organization-wide records
    records, total = await FinancialRecordService.get_all_records(
        db,
        skip,
        limit,
        record_type,
        category,
        start_date,
        end_date
    )
    return {
        "data": records,
        "total": total,
        "skip": skip,
        "limit": limit
    }


@router.put("/{record_id}", response_model=FinancialRecordResponse)
async def update_record(
    record_id: int,
    record_update: FinancialRecordUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(verify_admin)
):
    """Update a financial record (Admin only)"""
    return await FinancialRecordService.update_record(db, record_id, current_user.id, record_update)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_record(
    record_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(verify_admin)
):
    """Delete a financial record (Admin only)"""
    await FinancialRecordService.delete_record(db, record_id, current_user.id)
    return None
