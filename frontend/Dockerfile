FROM node:22-slim AS builder

WORKDIR /app

# Copy package files and Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

#expose Vite dev server port
EXPOSE 5173

CMD ["npm", "run", "dev"]