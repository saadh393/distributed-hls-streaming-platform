FROM node:20-alpine


WORKDIR /app

RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm install

COPY . .

ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

EXPOSE 3003

CMD ["npm", "run", "dev"]