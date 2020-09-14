## Base image: Node
#FROM node:alpine
#
#WORKDIR /app
#
#COPY package*.json ./
#RUN npm install --silent
#
#COPY . ./
#
## start app
#CMD ["npm", "run", "start-react"]

FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --silent
# add app
COPY ./ ./

# start app
CMD ["npm", "run", "start-react"]