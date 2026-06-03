"""
Database connection for the query service.

Table definitions are imported from the shared ``ctiris_db`` package
(db-svc/src/ctiris_db) which is the single source of truth for the
CTIris schema.
"""

import os

import sqlalchemy as sa

from ctiris_db.models import Feed, IngestionLog, StixObject

feeds_table = Feed.__table__
stix_objects_table = StixObject.__table__
ingestion_log_table = IngestionLog.__table__

_engine: sa.Engine | None = None


def get_engine() -> sa.Engine:
    global _engine
    if _engine is None:
        url = os.environ.get(
            "DATABASE_URL",
            "postgresql+psycopg://postgres:postgres@postgres:5432/ctiris",
        )
        _engine = sa.create_engine(url, pool_pre_ping=True)
    return _engine
