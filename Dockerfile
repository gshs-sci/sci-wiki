FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run prisma:generate

EXPOSE 3000

EXPOSE 5555

CMD ["npm", "run", "dev"]