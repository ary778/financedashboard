from sqlalchemy import Column, Integer, String
from .base import Base

class FinancialRecord(Base):
    __tablename__ = 'financial_records'
    id=Column(Integer, primary_key=True)
    amount=Column(Integer, nullable=False)
    type=Column(String, nullable=False)  #'income'or'expense'
    category=Column(String, nullable=False)
    date=Column(String, nullable=False)  #ISO format 'YYYY-MM-DD'
    description=Column(String, nullable=True)
    
    def __repr__(self):
        return f"<Record(amount={self.amount}, type={self.type}, category={self.category})>"