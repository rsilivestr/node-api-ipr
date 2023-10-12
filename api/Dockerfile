FROM node:18-alpine
ENV DATABASE_URL=postgresql://user:password@db:5432/db?schema=public
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn prisma generate
EXPOSE 3000
CMD ["yarn", "dev"]
