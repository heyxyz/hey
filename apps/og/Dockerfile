FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

#--
FROM base AS builder
WORKDIR /app
