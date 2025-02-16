#!/bin/bash

set -e

cd ../../planner-backend

# Ensure mvnw is executable
chmod +x ./mvnw

# Run Maven clean package and log output
echo "Running Maven build..."
./mvnw clean package | tee maven_build.log

# Check if Maven succeeded
if [ $? -ne 0 ]; then
  echo "Maven build failed. Check maven_build.log for details."
  read -p "Press Enter to exit..."
  exit 1
fi

# Navigate to schichtconfig/docker directory
cd ../schichtconfig/docker

# Build Docker images without cache
echo "Building Docker images..."
docker compose -f docker-compose-no-front.yml build --no-cache

# Start the Docker containers
echo "Starting Docker containers..."
docker compose -f docker-compose-no-front.yml up