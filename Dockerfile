# Base image: Node
FROM node:alpine

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install --silent

# add app
COPY . /app

# start app
CMD ["npm", "run", "start-react"]