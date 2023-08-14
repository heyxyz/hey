FROM node:alpine

WORKDIR /app

# Copy the package.json and pnpm-workspace.yaml (if applicable)
COPY package.json .
COPY pnpm-workspace.yaml .   # Modify if using a different configuration file

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Expose the necessary port
EXPOSE 5001

# Copy the rest of the application code
COPY . .

# Copy the environment file
COPY packages/sns/.env.example .env

# Start the application
CMD ["pnpm", "start"]
