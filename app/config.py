import os
import pathlib
from functools import lru_cache

from app.utils.logger_utils import get_logger
from dotenv import load_dotenv

load_dotenv()
logger = get_logger(__name__)


# Currently not using a database yet, but leaving this here for when db is implemented
# def _build_and_get_database_url(db_instance: str = None) -> str:
#     logger.info("Building DB URL from .env vars")

#     logger.debug("Attempting to get vars from .env...")
#     try:
#         if db_instance == "testing":
#             logger.debug("Detected testing config, using TEST_DB_* vars")

#             user: str = os.getenv("TEST_DB_USER")
#             password: str = os.getenv("TEST_DB_PASSWORD")
#             db_name: str = os.getenv("TEST_DB_NAME")
#             host: str = os.getenv("TEST_DB_HOST")
#             port: str = os.getenv("TEST_DB_PORT")
#         else:
#             logger.debug("Detected non-testing config, using DB_* vars")

#             user: str = os.getenv("DB_USER")
#             password: str = os.getenv("DB_PASSWORD")
#             db_name: str = os.getenv("DB_NAME")
#             host: str = os.getenv("DB_HOST")
#             port: str = os.getenv("DB_PORT")

#     except Exception as e:
#         logger.error(
#             "Could not get vars from .env! Please check that the .env file exists and has the correct DB vars."
#         )
#         logger.exception(e)

#     logger.debug("Successfully got env vars from .env file!")

#     db_url: str = "postgresql://{}:{}@{}:{}/{}".format(user, password, host, port, db_name)
#     logger.debug("Built db_url")

#     logger.info("Returning db_url string!")
#     return db_url


def _build_and_get_app_metadata() -> dict:
    logger.info("Building APP_METADATA dict from .env vars")

    logger.debug("Attempting to build dict from .env...")
    try:
        title: str = os.getenv("APP_TITLE")
        description: str = os.getenv("APP_DESC")
        version: str = os.getenv("APP_VERSION")
    except Exception as e:
        logger.error("Could not get vars from .env! Please check that the .env file exists and has APP METADATA vars")
        logger.exception(e)

    logger.debug("Successfully got env vars from .env file!")

    app_metadata: dict = {"title": title, "description": description, "version": version}
    logger.debug("App metadata dict built: {}".format(app_metadata))

    logger.info("Returning app_metadata dict!")
    return app_metadata


class BaseConfig:
    logger.debug("Setting up BaseConfig")
    ENVIRONMENT: str = os.getenv("FASTAPI_CONFIG")

    PROJECT_ROOT: pathlib.Path = pathlib.Path(__file__).parent.parent
    APP_ROOT: pathlib.Path = pathlib.Path(__file__).parent
    logger.debug("PROJECT_ROOT: {}, APP_ROOT: {}".format(PROJECT_ROOT, APP_ROOT))

    # Uncomment this when db is implemented
    # DATABASE_URL: str = _build_and_get_database_url()

    FASTAPI_APP_METADATA: dict = _build_and_get_app_metadata()
    logger.debug("FASTAPI_APP_METADATA: {}".format(FASTAPI_APP_METADATA))

    SECRET_KEY: str = os.getenv("SECRET_KEY")
    logger.debug("SECRET_KEY: {}".format(SECRET_KEY))

    API_VERSION_STRING: str = os.getenv("API_VERSION_STRING")
    logger.debug("Api prefix/version string: {}".format(API_VERSION_STRING))

    BASIC_AUTH_USER: str = os.getenv("BASIC_AUTH_USER")
    BASIC_AUTH_PASS: str = os.getenv("BASIC_AUTH_PASS")
    logger.debug("Basic auth username: {}".format(BASIC_AUTH_USER))
    logger.debug("Basic auth password: {}".format(BASIC_AUTH_PASS))


class DevelopmentConfig(BaseConfig):
    pass


# Production config not needed yet
class ProductionConfig(BaseConfig):
    # AWS_KEY: str = os.getenv("AWS_KEY")
    # AWS_SECRET: str = os.getenv("AWS_SECRET")
    pass


# Testing config not needed yet
class TestingConfig(BaseConfig):
    # DATABASE_URL: str = _build_and_get_database_url(db_instance="testing")
    pass


@lru_cache()
def get_settings(config_name: str = None):
    config_cls_dict = {"development": DevelopmentConfig, "production": ProductionConfig, "testing": TestingConfig}

    if not config_name:
        config_name = os.environ.get("FASTAPI_CONFIG", "development")

    config_cls = config_cls_dict[config_name]
    return config_cls()


settings = get_settings()
