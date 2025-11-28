# frontend/Dockerfile

# -----------------------------
# Stage 1: Build the frontend
# -----------------------------
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies based on package.json / package-lock.json
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# If you use environment-dependent base URLs, set them via VITE_ vars or adjust vite.config.js
RUN npm run build

# -----------------------------
# Stage 2: Serve with nginx
# -----------------------------
FROM nginx:alpine AS production

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (see nginx.conf below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 and run nginx in the foreground
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]