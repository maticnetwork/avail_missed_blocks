FROM node:17-alpine

RUN apk add g++ make py3-pip

WORKDIR /app

COPY package.json .

COPY . .

RUN yarn install

EXPOSE 8080

CMD ["yarn", "watch"]