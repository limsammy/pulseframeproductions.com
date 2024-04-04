from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


from app.utils.logger_utils import get_logger
from app.config import settings

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


def configure_static_files(app: FastAPI) -> FastAPI:
    static_dir_absolute = settings.APP_ROOT / "static"
    static_dir = str(static_dir_absolute.relative_to(settings.PROJECT_ROOT))
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

    return app
