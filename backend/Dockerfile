# Stage 1: Build
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (if needed, for example with TypeScript)
# RUN npm run build

# Stage 2: Runtime
FROM node:20-slim

# Create a group and user
RUN groupadd -r testgroup && useradd -r -g testgroup testuser
RUN chsh -s /usr/sbin/nologin root

# Set the working directory
WORKDIR /app

# Copy the build output from the previous stage (if there is any)
# COPY --from=build /app/build ./build

# Copy application source code
COPY --from=build /app .

# Install production dependencies
RUN npm install --only=production

# Change ownership of the entire working directory to testuser
RUN chown -R testuser:testgroup /app

# Switch to testuser
USER testuser

# Expose the port the app runs on
EXPOSE ${PORT}

# Command to start the application
CMD npm start
