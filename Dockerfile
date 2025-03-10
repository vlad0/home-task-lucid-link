#Stage 1 - build frontend
FROM node:22 AS react-build

WORKDIR /app/frontend

COPY frontend/ ./
RUN npm install

RUN npm run build

#Stage 3 - build backend
FROM node:22 AS nest-build

WORKDIR /app/backend

COPY backend/ ./
RUN npm install

RUN npm run build

#Stage 3 - build production
FROM node:22 AS production

WORKDIR /app

COPY --from=nest-build /app/backend/dist ./backend/dist
COPY --from=react-build /app/frontend/dist ./backend/dist/app

WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN mkdir data
COPY backend/data ./data
RUN npm install --only=production

EXPOSE 3000

ENV NODE_ENV=production

# Run the NestJS app (which will also serve React's static files)
CMD ["node", "dist/main.js"]
