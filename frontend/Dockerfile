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

FROM node:current

WORKDIR /app

COPY package*.json ./
# RUN npm uninstall node-sass
# RUN npm install node-sass@4.14.1
RUN npm install
# add app
COPY ./ ./

# start app
CMD ["npm", "run", "start-react:default"]
# CMD ["react-scripts", "start"]