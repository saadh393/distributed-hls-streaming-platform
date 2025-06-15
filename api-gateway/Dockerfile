# Use the official Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy only source files for now (code will be mounted in dev)
COPY . .

ENV PORT=3000

EXPOSE 3000

# Default command (overridden in docker-compose)
CMD ["npm", "run", "dev"]