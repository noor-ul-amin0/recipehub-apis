# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Copy application code into the container
COPY ./ ./

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

RUN npm i -g typescript

# Install application dependencies
RUN npm ci
# If you are building your code for production
# RUN npm ci --omit=dev (don't use it if you're using Typescript)

# Expose container port
EXPOSE 8080

# Specify the command to run when the container starts
# CMD [ "npm","start" ]
