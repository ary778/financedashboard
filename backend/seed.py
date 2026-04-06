"""
Database seeding script for demo data
Run this after initializing the database to create demo accounts
"""

import sys
import asyncio
sys.settrace(None)
import hashlib
import sys
from datetime import datetime, timedelta
from pathlib import Path
from decimal import Decimal

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from backend.base import AsyncSessionLocal
from backend.models.role import Role
from backend.models.user import User
from backend.models.financial_record import FinancialRecord
from sqlalchemy import select


async def seed_database():
    async with AsyncSessionLocal() as session:
        try:
            # Seed Roles
            print("Seeding roles...")
            
            # Check if roles exist
            result = await session.execute(select(Role))
            existing_roles = result.scalars().all()
            
            if not existing_roles:
                roles = [
                    Role(id=1, name='Viewer', description='View-only access to dashboard'),
                    Role(id=2, name='Analyst', description='Can create and modify financial records'),
                    Role(id=3, name='Admin', description='Full system access including user management')
                ]
                session.add_all(roles)
                await session.commit()
                print("✓ Roles created")
            else:
                print("✓ Roles already exist")

            # Seed Demo Users
            print("Seeding demo users...")
            
            result = await session.execute(select(User))
            existing_users = result.scalars().all()
            
            if not existing_users:
                demo_users = [
                    User(
                        name='viewer_demo',
                        email='viewer@test.com',
                        password=hashlib.sha256('test123'.encode()).hexdigest(),
                        role_id=1,
                        is_active=1
                    ),
                    User(
                        name='analyst_demo',
                        email='analyst@test.com',
                        password=hashlib.sha256('test123'.encode()).hexdigest(),
                        role_id=2,
                        is_active=1
                    ),
                    User(
                        name='admin_demo',
                        email='admin@test.com',
                        password=hashlib.sha256('test123'.encode()).hexdigest(),
                        role_id=3,
                        is_active=1
                    )
                ]
                session.add_all(demo_users)
                await session.commit()
                print("✓ Demo users created")
                print("\nDemo Accounts:")
                print("  Viewer: viewer@test.com / test123")
                print("  Analyst: analyst@test.com / test123")
                print("  Admin: admin@test.com / test123")
            else:
                print("✓ Demo users already exist")

            # Clean up existing financial records to provide a blank slate for testing
            print("Cleaning up old dummy financial records to provide a clean slate...")
            from sqlalchemy import delete
            await session.execute(delete(FinancialRecord))
            await session.commit()
            print("✓ Financial records wiped successfully! Ready for admin to add real data.")

            print("\n✓ Database seeding completed successfully!")

        except Exception as e:
            print(f"✗ Error seeding database: {str(e)}")
            import traceback
            traceback.print_exc()
            await session.rollback()


if __name__ == '__main__':
    asyncio.run(seed_database())
