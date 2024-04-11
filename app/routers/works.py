from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from jinja_partials import register_starlette_extensions

from app.utils.logger_utils import get_logger

logger = get_logger(__name__)


tags_metadata = [
    {
        "name": "works",
        "description": "Router for handling all 'Work' model and routing",
    }
]

logger.info("Creating core_router...")
router = APIRouter(
    # prefix="core",  # Since we do not have any other functionality other than static html files, omit prefix (I think omitting a prefix is the same as setting it to ")
    tags=["works"],
    responses={404: {"description": "Not found"}},
)

# TODO: Move BASE_DIR to app/config.py
BASE_DIR = Path(__file__).resolve().parent.parent
logger.debug("Set BASE_DIR to: {}".format(BASE_DIR))

# TODO: Shouold we move this to app/config.py?
logger.debug("Setting Jinja2Templates directory to: {}".format(str(Path(BASE_DIR, "templates"))))
templates = Jinja2Templates(directory=str(Path(BASE_DIR, "templates")))
logger.debug("Attempting to register jinja partials...")
try:
    register_starlette_extensions(templates)
    logger.info("Registered jinja partials!")
except Exception as error:
    logger.error("Error registering jinja partials: {}".format(error))
    raise error


@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    logger.info("Received GET request to /")
    logger.debug("Rendering index template...")

    return templates.TemplateResponse(request=request, name="index.html.jinja", context={"title": "PulseFrame | Home"})
