from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime
from ..base import Base


class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(128), nullable=False)
    is_active = Column(Integer, default=1)  # 1 for active, 0 for inactive
    role_id = Column(Integer, ForeignKey('roles.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<User(name='{self.name}', email='{self.email}')>"
    
    