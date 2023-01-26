FROM node:17-alpine

WORKDIR /app

COPY package.json .

COPY . .

RUN npm install

EXPOSE 7000

CMD ["npm", "run" "watch"]