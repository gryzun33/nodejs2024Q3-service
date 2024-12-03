FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

EXPOSE 4000

RUN npx prisma generate

RUN npm run build

CMD ["npm", "run", "start"]