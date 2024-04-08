from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.utils.logger_utils import get_logger

logger = get_logger(__name__)


tags_metadata = [
    {
        "name": "core",
        "description": "Core functionality for main website. This is very basic webapp functions such as GETs to /foo return a foo.html template.",
    }
]

logger.info("Creating core_router...")
router = APIRouter(
    # prefix="core",  # Since we do not have any other functionality other than static html files, omit prefix (I think omitting a prefix is the same as setting it to ")
    tags=["core"],
    responses={404: {"description": "Not found"}},
)
logger.info("Created core_router!")
logger.info("Creating Jinja2Templates instance...")
templates = Jinja2Templates(directory="templates/")
logger.info("Created Jinja2Templates instance!")


@router.get("/", response_class=HTMLResponse)
async def root(request: Request):
    logger.info("Received GET request to /")
    #     return {"message": "Hello World"}

    # logger.debug("Returniing FastAPI app instance"
    return templates.TemplateResponse("index.html", {"request": request})
