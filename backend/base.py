from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from .config import settings  # Import your settings

# No more hardcoded strings!
engine = create_async_engine(settings.DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
        # Tip: Only commit here if you want EVERY GET request to commit. 
        # Usually, it's safer to call await db.commit() inside your POST/PUT routes.