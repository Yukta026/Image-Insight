FROM node:latest

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm clean-install

# Copy the rest of the application code
COPY . /app

# Copy .env file to the working directory
COPY .env /app/.env

# Build the React app
RUN npm run build

# Install serve globally to serve the production build
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Serve the production build using serve
ENTRYPOINT ["serve", "-s", "build"]
