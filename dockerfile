FROM node:22-trixie-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8888

CMD ["npm", "run", "start"]