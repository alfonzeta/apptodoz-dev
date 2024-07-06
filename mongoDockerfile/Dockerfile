FROM mongo:latest

# Create a non-root user and group
RUN groupadd -r testgroup && useradd -r -g testgroup testuser


# Set permissions for the MongoDB data directory
RUN chown -R testuser:testgroup /data/db

# Switch to the non-root user
USER testuser

# Run MongoDB as a non-root user
CMD ["mongod"]
