FROM node:alpine

ARG GITHUB_AUTH_TOKEN
WORKDIR /app
COPY .npmrc ./
COPY package*.json ./

RUN npm install --only=prod
RUN rm -f .npmrc
COPY . .

CMD ["npm", "start"]