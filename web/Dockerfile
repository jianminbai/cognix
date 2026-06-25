FROM node:20-alpine AS builder
WORKDIR /app
COPY web/package*.json ./web/
RUN cd web && npm ci
COPY . .
RUN cd web && npm run build

FROM nginx:alpine
COPY --from=builder /app/web/out /usr/share/nginx/html
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
