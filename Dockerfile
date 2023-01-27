FROM node:17-alpine

WORKDIR /app

COPY package.json .

COPY . .

RUN yarn install

EXPOSE 7000

CMD ["yarn", "watch"]