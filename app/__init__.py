from fastapi import FastAPI

from app.utils.logger_utils import get_logger

logger = get_logger(__name__)


def create_app() -> FastAPI:
    """App Factory for creating and returning FastAPI app instance"""
    logger.debug("Creating FastAPI app instance")
    app = FastAPI()

    @app.get("/")
    async def root():
        return {"message": "Hello World"}

    logger.debug("Returniing FastAPI app instance")
    return app
