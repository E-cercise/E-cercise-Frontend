# =============================
#    STAGE 1: Build the App
# =============================
FROM node:18 AS build

# Create and use the working directory
WORKDIR /app

ARG API_BASE_URL

ENV API_BASE_URL=$API_BASE_URL

# Copy package and lock files first (for efficient caching of dependencies)
COPY package.json ./

# Use npm ci for a clean, reproducible install
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the project (this will create a production-ready bundle in /app/dist)
RUN npm run build

FROM nginx:alpine

# Copy the production build from the "build" stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]