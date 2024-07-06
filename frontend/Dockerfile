# Stage 1: Build stage
FROM node:20-slim as build
# Set the working directory for the build stage
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime stage
FROM node:20-slim
# Set the working directory for runtime stage
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app .

# Create a group and user
RUN groupadd -r testgroup && useradd -r -g testgroup testuser

# Change ownership of the entire working directory to testuser
RUN chown -R testuser:testgroup /app

# Switch to testuser
USER testuser

# Expose the port the app runs on
EXPOSE 5173

# Command to start the application
CMD npm run dev
