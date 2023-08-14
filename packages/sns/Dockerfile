FROM node:alpine

WORKDIR /app

# Copy the package.json and pnpm-workspace.yaml (if applicable)
COPY ../../package.json .
COPY ../../pnpm-workspace.yaml .

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Copy the environment file
COPY .env.example .env

# Expose the necessary port
EXPOSE 5001

# Start the application
CMD ["pnpm", "start"]
