from app import create_app, configure_static_files, configure_routers
from app.utils.logger_utils import get_logger
from app.config import settings

logger = get_logger(__name__)


logger.info("Creating FastAPI app instance...")
app = create_app(**settings.FASTAPI_APP_METADATA)
logger.info("Created FastAPI app instance!")

logger.info("Configuring static files...")
app = configure_static_files(app)
logger.info("Configured static files!")

logger.info("Registering routers")
app = configure_routers(app)
logger.info("Registered routers!")
