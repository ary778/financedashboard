from sqlalchemy import Column, Integer, String
from .base import Base

class Role(Base):
    _tablename__ = 'roles'
    id=Column(Integer, primary_key=True)
    name=Column(String(50), unique=True, nullable=False)
    