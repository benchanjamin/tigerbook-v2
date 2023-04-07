# The first stage
# Build React static files
FROM node:19.1.0-alpine as build

WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend/ ./
RUN npm run build
CMD [ "npm", "start" ]