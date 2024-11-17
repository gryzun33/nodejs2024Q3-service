FROM node:22-alpine AS development
WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci && npm cache clean --force
COPY --chown=node:node . .
RUN npx prisma generate
USER node


FROM node:22-alpine AS build
WORKDIR /app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build

ENV NODE_ENV=production

RUN npm ci --only=production && npm cache clean --force
USER node

FROM node:22-alpine AS production

ENV NODE_ENV=production

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
EXPOSE 4000
CMD [ "node", "dist/main.js" ]