FROM node:20-alpine


WORKDIR /app

RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3003

CMD ["npm", "run", "dev"]