# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM node:20-alpine

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 3007

CMD ["serve", "-s", "dist", "-l", "3007"]