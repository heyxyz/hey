# Base image
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

# Installer stage
FROM base AS installer
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy all files to the build context
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Prune dev dependencies to reduce image size
RUN pnpm prune --prod

# Ensure app and node_modules are owned by non-root user
RUN chown -R 1001:1001 /app

# Runner stage
FROM base AS runner
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Add non-root user for better security
RUN addgroup --system --gid 1001 hey
RUN adduser --system --uid 1001 app

# Ensure the app directory and node_modules are accessible by the non-root user
COPY --from=installer /app /app
RUN chown -R 1001:1001 /app

# Switch to non-root user
USER app

# Expose the port
EXPOSE 4784

# Command to run the app
CMD sleep 3 && pnpm --filter @hey/api run start
