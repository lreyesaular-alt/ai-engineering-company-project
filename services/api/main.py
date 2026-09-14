from fastapi import FastAPI

from .routers.health import router as health_router

app = FastAPI(
    title="Brasaland API",
    description="API centralizada para los servicios backend de Brasaland.",
    version="0.1.0",
)

app.include_router(health_router)
