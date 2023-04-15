FROM node:19.1.0-alpine as build

WORKDIR /app/frontend
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
COPY ./frontend/ ./
RUN rm -rf ./frontend/node_modules
RUN npm install
RUN npm install flowbite-react
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]