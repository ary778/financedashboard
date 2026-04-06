import sys
import asyncio
sys.settrace(None)
import sys
from pathlib import Path
import os

os.chdir(Path(__file__).parent)
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.base import engine, Base
from backend.models.user import User
from backend.models.role import Role
from backend.models.financial_record import FinancialRecord

async def init_db_and_tables():
    """Create database tables"""
    print("✓ Initializing SQLite database...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print('✓ Database tables created successfully!')
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == '__main__':
    asyncio.run(init_db_and_tables())
