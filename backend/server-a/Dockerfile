# This is where you define the image for
# the server A, which implements the Swagger API.

# Start by copying the server stub to this directory.

# You should then use Noje image from Docker Hub as the basis,
# and then follow the instructions linked to in assignment document.
# You should be able to produce a working installation by just
# following the instructions.


#FROM node:version...
FROM node:15

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

ENV PORT=8080
ENV ACCESS_TOKEN_SECRET_KEY="mysecretkey"

# Expose port 8080 for incoming traffic
# EXPOSE 8080

# Start the server by default when the container starts
CMD [ "npm", "start" ]
