"""Serve the built SPA without converting missing API routes into HTML responses."""

from starlette.exceptions import HTTPException
from starlette.staticfiles import StaticFiles


class FrontendFiles(StaticFiles):
    async def get_response(self, path, scope):
        path = path.replace("\\", "/").lstrip("/")
        if path == "api" or path.startswith("api/"):
            raise HTTPException(404)
        try:
            return await super().get_response(path, scope)
        except HTTPException as error:
            if error.status_code != 404 or "." in path.rsplit("/", 1)[-1]:
                raise
            return await super().get_response("index.html", scope)
