# Stage 1: install dependencies
FROM node:18 AS deps
COPY package.json ./
RUN npm install

# Stage 2: build
FROM node:18-alpine AS builder
ENV NODE_ENV production
ARG STS_BUCKET_NAME
ARG STS_BUCKET_REGION
ARG STS_ENDPOINT
ARG STS_FILE_PATH
ARG STS_CORS
ARG STS_PORT
ENV STS_BUCKET_NAME ${STS_BUCKET_NAME}
ENV STS_BUCKET_REGION ${STS_BUCKET_REGION}
ENV STS_ENDPOINT ${STS_ENDPOINT}
ENV STS_FILE_PATH ${STS_FILE_PATH}
ENV STS_CORS ${STS_CORS}
ENV STS_PORT ${STS_PORT}
COPY --from=deps node_modules ./node_modules
COPY --from=deps package.json ./
COPY src ./src
COPY tsconfig.json ./tsconfig.json
RUN npm run build

# Stage 3: run
FROM node:18-alpine
COPY --from=builder dist ./dist
COPY --from=builder node_modules ./node_modules
COPY --from=builder package.json ./
ARG STS_PORT
EXPOSE ${STS_PORT}
ENV STS_PORT ${STS_PORT}
CMD ["npm", "run", "start"]
