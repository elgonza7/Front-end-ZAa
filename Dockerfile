# docker build -f Dockerfile -t zeroautoapp-frontend \
#   --build-arg VITE_API_BASE_URL=https://api.tudominio.com/api .

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Vite incrusta las env vars VITE_* en el bundle en tiempo de build, no de
# arranque — por eso va como build-arg y no como variable de entorno del
# contenedor final.
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
