from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..base import get_db
from ..schemas import DashboardSummary
from ..services.financial_service import FinancialRecordService
from .dependencies import get_current_user, ROLE_ANALYST, ROLE_ADMIN

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get dashboard summary with financial analytics (All authenticated users)
    
    - Admin/Analyst: See organization-wide analytics
    - Viewer: See organization-wide analytics (read-only)
    """
    
    # All users (Viewer, Analyst, Admin) see organization-wide dashboard
    if current_user.role_id in [ROLE_ANALYST, ROLE_ADMIN]:
        # Analysts and Admins see full organization data
        summary = await FinancialRecordService.get_organization_summary(db)
    else:
        # Viewers also see organization data but can't modify anything
        summary = await FinancialRecordService.get_organization_summary(db)
    
    return {
        "total_income": summary['total_income'],
        "total_expense": summary['total_expense'],
        "net_balance": summary['net_balance'],
        "category_breakdown": [
            {
                "category": cat['category'],
                "total_amount": cat['total_amount'],
                "count": cat['count']
            }
            for cat in summary['category_breakdown']
        ],
        "recent_records": summary['recent_records'],
        "record_count": summary['record_count']
    }
