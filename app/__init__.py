from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


from app.utils.logger_utils import get_logger
from app.config import settings

logger = get_logger(__name__)


def create_app() -> FastAPI:
    """App Factory for creating and returning FastAPI app instance"""
    logger.debug("Creating FastAPI app instance")
    app = FastAPI(
        title=title,
        description=description,
        version=version,
        docs_url=None,
        redoc_url=None,
        openapi_prefix=None,
        # openapi_tags=(),
        # openapi_url="{}/openapi.json".format(settings.API_VERSION_STRING),
    )

    ####################
    # Register routers #
    ####################
    logger.info("Importing API routers...")
    from app.routers import ROUTERS

    logger.info("Registering {} routers...".format(len(ROUTERS)))
    for router in ROUTERS:
        app.include_router(router, prefix=settings.API_VERSION_STRING)
        logger.info("Registered router: {}".format(router.prefix))
    logger.info("Done registering routers!")

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
