import os
from pathlib import Path
from typing import List


def _parse_origins(raw_origins: str) -> List[str]:
    if not raw_origins:
        return []
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


class Config:
    def __init__(self) -> None:
        backend_dir = Path(__file__).resolve().parents[1]
        default_data_path = backend_dir / "bu_study_spaces.json"

        self.DATA_PATH = os.getenv("DATA_PATH", str(default_data_path))
        self.CORS_ORIGINS = _parse_origins(os.getenv("CORS_ORIGINS", ""))
        self.RATELIMIT_DEFAULT = os.getenv("RATE_LIMIT", "60 per minute")
        self.MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", "1048576"))
        self.LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
