import base64
import os
import re
import secrets
import sys
from contextlib import asynccontextmanager

from argon2 import PasswordHasher
from common.database import engine
from common.database_demo import get_db_session
from common.models import Base, Token, User, Workspace
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from loguru import logger
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from webapp.api import router as api_router
from webapp.demo_workspace import example_workspace

load_dotenv(override=True)

logger.remove(0)
logger.add(sys.stderr, level=os.getenv("SESAME_WEBAPP_LOG_LEVEL", "DEBUG"))


# ========================
# FastAPI App
# ========================


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as conn:
            if bool(int(os.getenv("SESAME_DATABASE_USE_REFLECTION", "0"))):
                await conn.run_sync(Base.metadata.reflect)
    except Exception:
        logger.error(
            "Database connection failed. Have you set a valid SESAME_DATABASE_URL in your server/.env?"
        )
    yield
    await engine.dispose()


app = FastAPI(
    title="Open Sesame",
    docs_url="/docs",
    openapi_tags=[{"name": "Authentication", "description": "API protected by Bearer tokens"}],
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

templates = Jinja2Templates(directory="webapp/dashboard")


# ========================
# Quickstart route
# ========================


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    if int(os.getenv("SESAME_SHOW_WEB_UI", "0") or 0) != 1:
        raise HTTPException(status_code=404, detail="Page not found")

    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        return templates.TemplateResponse(
            request,
            "error.html",
            {
                "message": "Unable to connect to database. Have you set a valid SESAME_DATABASE_URL in your server/.env ?",
            },
        )

    try:
        async with engine.begin() as conn:
            result = await conn.execute(
                text("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")
            )
            count = result.scalar()
            if count == 0:
                raise
    except Exception:
        return templates.TemplateResponse(
            request,
            "error.html",
            {
                "message": "Sesame schema not found in database. Have you run bash scripts/run_schema.sh ?",
            },
        )

    return templates.TemplateResponse(
        request,
        "index.html",
        {
            "message": "Sesame running. Visit /docs for API documentation.",
        },
    )


@app.post("/demo", response_class=JSONResponse)
async def demo(
    request: Request,
    db_session: AsyncSession = Depends(get_db_session),
):
    """Create new demo user account"""
    random_bytes = secrets.token_bytes(32)
    base64_string = base64.b64encode(random_bytes).decode("utf-8")
    random_user_id = re.sub(r"[^a-zA-Z0-9]", "", base64_string)

    random_username = secrets.token_hex(8)
    random_bytes = secrets.token_bytes(16)
    random_password = base64.b64encode(random_bytes).decode("utf-8")

    ph = PasswordHasher()
    password_hash = ph.hash(random_password)

    new_user = User(user_id=random_user_id, username=random_username, password_hash=password_hash)
    db_session.add(new_user)

    await db_session.flush()

    """Create a new token for the user"""
    token = await Token.create_token_for_user(
        new_user.user_id,
        db_session,
        title="Demo token",
        expiration_minutes=43200,
    )

    """ Create a new workspace for the user """
    new_workspace = Workspace(
        title="Demo Workspace", user_id=new_user.user_id, config=example_workspace
    )
    db_session.add(new_workspace)

    await db_session.commit()

    return {
        "token": token.token,
        "workspace_id": new_workspace.workspace_id,
    }
