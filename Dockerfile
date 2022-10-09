FROM node:16

# Create app directory
RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

# Start the app.
EXPOSE 4080
CMD [ "npm", "run", "start" ]