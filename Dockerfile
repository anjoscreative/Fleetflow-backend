# Use official Node.js image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other source files
COPY . .

# Build the app
RUN npm run build

# Expose the port NestJS will run on
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start:prod"]
