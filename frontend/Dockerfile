FROM node:current

WORKDIR /app

COPY package*.json ./
RUN npm install
# add app
COPY ./ ./

# start app
CMD ["npm", "run", "start-react:default"]
# CMD ["npm", "run", "start-react:default"]