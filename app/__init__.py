from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


from app.utils.logger_utils import get_logger
from app.config import settings

logger = get_logger(__name__)


def create_app(title: str, summary: str, description: str, version: str, debug: str) -> FastAPI:
    """App Factory for creating and returning FastAPI app instance"""
    logger.info("Creating FastAPI app instance")
    logger.debug(
        "Creating app with metadata: title={}, summary={}, description={}, version={}, debug={}".format(
            title, summary, description, version, debug
        )
    )
    app = FastAPI(
        title=title,
        summary=summary,
        description=description,
        version=version,
        debug=bool(debug),
        docs_url=None,
        redoc_url=None,
        openapi_prefix=None,
        # openapi_tags=(),
        # openapi_url="{}/openapi.json".format(settings.API_VERSION_STRING),
    )

    logger.info("Checking if app instance is valid...")
    if app is None:
        logger.error("App instance is None!")
        raise ValueError("App instance is None!")
        return

    logger.info("Everything looks good. Returniing FastAPI app instance")
    return app


def configure_routers(app: FastAPI) -> FastAPI:
    """Configure routers for FastAPI app instance. Import routers and include them in app instance."""
    logger.info("Registering API routers...")
    from app.routers import core

    logger.debug("Registering core router...")
    app.include_router(core.router)

    logger.info("Registered routers!")

    # logger.info("Registering {} routers...".format(len(ROUTERS)))
    # for router in ROUTERS:
    #     app.include_router(router, prefix=settings.API_VERSION_STRING)
    #     logger.info("Registered router: {}".format(router.prefix))
    # logger.info("Done registering routers!")

    return app


def configure_static_files(app: FastAPI) -> FastAPI:
    """Configure static files for FastAPI app instance. Establish directory and mount to path."""
    static_dir_absolute = settings.APP_ROOT / "static"
    static_dir = str(static_dir_absolute.relative_to(settings.PROJECT_ROOT))
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

    return app
