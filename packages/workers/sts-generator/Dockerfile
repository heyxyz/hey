# Stage 1: install dependencies
FROM node:18 AS deps
COPY package.json ./
RUN npm install

# Stage 2: build
FROM node:18-alpine AS builder
ENV NODE_ENV production
COPY --from=deps node_modules ./node_modules
COPY --from=deps package.json ./
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY .env.example ./.env
RUN npm run build

# Stage 3: run
FROM node:18-alpine
COPY --from=builder dist ./dist
COPY --from=builder node_modules ./node_modules
COPY --from=builder package.json ./
EXPOSE 8082
ENV PORT 8082
CMD ["npm", "run", "start"]
