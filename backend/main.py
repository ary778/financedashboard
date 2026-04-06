import sys
sys.settrace(None)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, users, roles, records, dashboard

app = FastAPI(
    title="Finance Dashboard API",
    description="Backend API for finance dashboard system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(roles.router)
app.include_router(records.router)
app.include_router(dashboard.router)


@app.get("/")
def home():
    return {"message": "Welcome to the Finance Dashboard API"}


# Database tables are auto-created when the app starts
@app.on_event("startup")
async def startup_event():
    from .base import engine, Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created!")


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/dashboard")
def dashboard_redirect():
    return {"message": "Use /api/dashboard/summary for dashboard data"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)