# Stage 1: install dependencies
FROM node:18 AS deps
RUN npm install -g pnpm@8.5.1
COPY packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install

# Stage 2: build
FROM node:18-alpine AS builder
ARG APP_ENV
ENV NEXT_PUBLIC_APP_ENV ${APP_ENV}
ENV NODE_ENV production
RUN npm install -g pnpm
COPY --from=deps node_modules ./node_modules
COPY --from=deps packages ./packages
COPY src ./src
COPY public ./public
COPY .env.example ./.env
COPY package.json next.config.js next-env.d.ts tsconfig.json tailwind.config.js .prettierrc .prettierignore .linguirc postcss.config.js .eslintrc.js ./
RUN pnpm build

# Stage 3: run
FROM node:18-alpine
RUN npm install -g pnpm
COPY --from=builder .next ./.next
COPY --from=builder public ./public
COPY --from=builder node_modules ./node_modules
COPY --from=builder packages ./packages
COPY --from=builder package.json ./
EXPOSE 4783
ENV PORT 4783
CMD ["pnpm", "start"]
