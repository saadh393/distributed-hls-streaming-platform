FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .

ENV PORT=4001

EXPOSE 4001
CMD ["pnpm", "start"]
