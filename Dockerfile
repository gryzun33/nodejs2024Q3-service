FROM node:22-alpine

ENV PORT=4000
ENV DATABASE_URL=postgresql://postgres:123321@postgres_db:5432/musiclibrarydb?schema=public

WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 4000

RUN npx prisma generate

CMD ["npm","run", "start:dev"]