FROM node:22-bookworm-slim AS web
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig*.json vite.config.ts index.html ./
COPY src ./src
RUN npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 STATIC_DIR=/app/dist APP_ENV=production
WORKDIR /app
COPY backend/requirements.lock.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY backend /app/backend
COPY alembic.ini /app/alembic.ini
COPY --from=web /build/dist /app/dist
RUN useradd --create-home --uid 1000 app && chown -R app:app /app
USER app
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
