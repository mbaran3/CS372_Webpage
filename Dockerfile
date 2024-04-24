FROM alpine:latest AS build
RUN apk update && apk add git 


RUN git clone https://github.com/mbaran3/CS372_Webpage /CS372_Webpage

FROM node

COPY --from=build /CS372_Webpage /CS372_Webpage

WORKDIR /CS372_Webpage

RUN npm install
CMD npm run start 
