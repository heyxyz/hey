FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

FROM node:18-alpine AS builder
ARG APP_ENV
WORKDIR /app
COPY . .
COPY .env.example .env
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /usr/app
ARG APP_ENV
COPY --from=builder /app/build ./build
COPY package.json ./
COPY .env.example .env
RUN npm install -g pnpm
RUN pnpm install --prod
USER node
ENV NODE_ENV="production"
CMD ["npm", "start"]
