FROM alpine:latest AS build
FROM node
WORKDIR .
COPY package*.json .
RUN npm install
RUN npm rebuild bcrypt --build-from-source
COPY . . 
CMD ["npm", "start"] 
