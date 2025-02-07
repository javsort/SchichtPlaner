#!/bin/bash

# Ensure a container name is provided
if [ -z "$1" ]; then
  echo "Error: Container name is not provided."
  exit 1
fi

CONTAINER_NAME="$1"

echo "Rebuilding the container: $CONTAINER_NAME"

# Navigate to the backend directory
cd planner-backend || { echo "Error: planner-backend directory not found"; exit 1; }

# Ensure Maven wrapper is executable
chmod +x mvnw

# Build the corresponding module based on container name
if [ "$CONTAINER_NAME" = "planner-logic-gate" ]; then
  echo "Re-building Maven app for logic gate..."
  ./mvnw clean package -pl modules/logicGate -am

elif [ "$CONTAINER_NAME" = "planner-scheduler" ]; then
  echo "Re-building Maven app for scheduler..."
  ./mvnw clean package -pl modules/scheduler -am

elif [ "$CONTAINER_NAME" = "planner-auth" ]; then
  echo "Re-building Maven app for auth..."
  ./mvnw clean package -pl modules/auth -am

else
  echo "Error: Unknown container name."
  exit 1
fi

# Navigate back to the root directory
cd ..

# Rebuild the container
echo "Rebuilding the container..."
docker compose -f schichtconfig/docker/docker-compose.yml build --no-cache "$CONTAINER_NAME"

# Deploy the container
echo "Re-deploying the container..."
docker compose -f schichtconfig/docker/docker-compose.yml up -d "$CONTAINER_NAME"
