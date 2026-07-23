# Stage 1: Build React SPA
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Compile server TypeScript
FROM node:22-alpine AS server-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY server/ ./server/
COPY tsconfig.server.json .
RUN npm run build:server

# Stage 3: Runtime image
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=frontend /app/dist ./public
COPY --from=server-build /app/server/dist ./server/dist
# Copy schema.sql alongside compiled JS (client.ts reads it at runtime)
COPY server/db/schema.sql ./server/dist/db/schema.sql

ENV NODE_ENV=production
ENV PORT=3000
ENV IMAGES_DIR=/data/images

RUN mkdir -p /data/images

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/auth/me || exit 0

CMD ["node", "server/dist/index.js"]
