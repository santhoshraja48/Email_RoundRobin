# Use an official Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies (including react-router-dom)
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port React uses
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
