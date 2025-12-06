# Etapa 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app

# Copiar solo lo necesario para producción
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

# Iniciar el servidor SSR
CMD ["node", "dist/GameBox_web_Angular/server/server.mjs"]