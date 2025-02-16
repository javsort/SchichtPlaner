@echo off
setlocal

:: Navigate to planner-backend directory
cd ../../planner-backend

:: Run Maven clean package and log output
echo Running Maven build...
call mvnw.cmd clean package

:: Navigate to schichtconfig/docker directory
cd ../schichtconfig/docker

:: Build Docker images without cache
echo Building Docker images...
call docker compose -f docker-compose.yml build --no-cache

:: Start the Docker containers
echo Starting Docker containers...
call docker compose -f docker-compose.yml up