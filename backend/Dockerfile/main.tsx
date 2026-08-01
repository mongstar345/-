# ==========================================
# Stage 1: Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Build the application
RUN npm run build

# ==========================================
# Stage 2: Development Stage
# ==========================================
FROM node:20-alpine AS development

WORKDIR /app

# Install development dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000 3001

CMD ["npm", "run", "start:dev"]

# ==========================================
# Stage 3: Production Stage
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p /app/uploads /app/logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000 3001

CMD ["node", "dist/main"]
