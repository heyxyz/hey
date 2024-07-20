# Base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat

# Runner stage
FROM base AS runner
WORKDIR /app

RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./

# Copy turbo.json file
COPY turbo.json turbo.json

# Copy the rest of the application code
COPY . .

# Create non-root user and group
RUN addgroup --system --gid 1001 hey
RUN adduser --system --uid 1001 app

RUN pnpm install

# Set user
USER app

# Expose the port
EXPOSE 4784

# Command to run the app
CMD sleep 3 && pnpm --filter @hey/api run start
