FROM node:20-alpine

RUN apk add --no-cache ffmpeg bash

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .


ENV UPLOAD_DIR=/app/uploads
ENV OUTPUT_DIR=/app/processed

VOLUME ["/app/uploads", "/app/processed"]

CMD ["pnpm", "start"]