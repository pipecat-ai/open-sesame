import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("SESAME_DATABASE_ADMIN_URL")

if not DATABASE_URL:
    raise ValueError(
        "SESAME_DATABASE_ADMIN_URL is not set. Please set it in your .env file or environment variables."
    )

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(
    DATABASE_URL,
    pool_pre_ping=False,
    echo=bool(int(os.getenv("SESAME_DATABASE_ECHO_OUTPUT", "0"))),
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_db_session():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except SQLAlchemyError:
            await session.rollback()
            raise
        except Exception:
            raise
        finally:
            await session.close()


@asynccontextmanager
async def get_db_session_async_context():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except SQLAlchemyError as e:
            logger.exception(e)
            await session.rollback()
            raise
        finally:
            await session.close()
