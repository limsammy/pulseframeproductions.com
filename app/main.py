from app import create_app, configure_static_files
from app.utils.logger_utils import get_logger

logger = get_logger(__name__)


logger.info("Creating FastAPI app instance...")
app = create_app()
logger.info("Created FastAPI app instance!")

logger.info("Configuring static files...")
app = configure_static_files(app)
logger.info("Configured static files!")
