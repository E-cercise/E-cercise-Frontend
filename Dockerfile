# =============================
#    STAGE 1: Build the App
# =============================
FROM node:18 AS build

# Create and use the working directory
WORKDIR /app

# Copy package and lock files first (for efficient caching of dependencies)
COPY package.json ./

# Use npm ci for a clean, reproducible install
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the project (this will create a production-ready bundle in /app/dist)
RUN npm run build

# =============================
#    STAGE 2: Serve with Nginx
# =============================
FROM nginx:alpine

# Copy the production build from the "build" stage to Nginx's default html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 8000
EXPOSE 8000

# Start Nginx in the foreground (so Docker doesn’t exit)
CMD ["nginx", "-g", "daemon off;"]
