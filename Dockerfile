FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG SOCKET
ENV REACT_APP_SOCKET_URL=$SOCKET
ARG API_URL
ENV REACT_APP_API_URL=$API_URL
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
