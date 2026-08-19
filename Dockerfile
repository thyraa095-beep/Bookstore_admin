# ---- Build stage: compile the React app ----
FROM node:22-alpine AS build
WORKDIR /app

# API base URL used at build time (override with REACT_APP_API_URL on Render)
ARG REACT_APP_API_URL=https://bookstore-backend-wtpr.onrender.com/api/v1
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Serve stage: nginx with SPA fallback ----
FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Only substitute $PORT in the nginx template (keeps $uri intact)
ENV NGINX_ENVSUBST_FILTER=PORT
EXPOSE 10000
