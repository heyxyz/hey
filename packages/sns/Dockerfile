FROM node:alpine
WORKDIR /app
COPY . .
COPY .env.example .env
RUN npm install -g pnpm
RUN pnpm install
EXPOSE 5001
CMD ["npm", "start"]
