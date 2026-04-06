from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey
from ..base import Base


class FinancialRecord(Base):
    __tablename__ = 'financial_records'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    type = Column(String(20), nullable=False)  # 'income' or 'expense'
    category = Column(String(50), nullable=False)
    date = Column(String, nullable=False)  # ISO format 'YYYY-MM-DD'
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<FinancialRecord(amount={self.amount}, type={self.type}, category={self.category})>"