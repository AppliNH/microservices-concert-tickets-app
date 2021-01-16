FROM node:alpine

WORKDIR /app
COPY .npmrc ./
COPY package*.json ./
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]