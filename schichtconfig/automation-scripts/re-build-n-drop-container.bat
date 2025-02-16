@echo off
setlocal enabledelayedexpansion

:: Ensure a container name is provided
if "%~1"=="" (
    echo Error: Container name is not provided.
    exit /b 1
)

set CONTAINER_NAME=%1

echo Rebuilding the container: %CONTAINER_NAME%

:: Navigate to the backend directory
cd ../../planner-backend || exit /b 1

:: Build the corresponding module based on container name
if "%CONTAINER_NAME%"=="planner-logic-gate" (
    echo Re-building Maven app for logic gate...
    call mvnw.cmd clean package -pl modules/logicGate -am
) else if "%CONTAINER_NAME%"=="planner-scheduler" (
    echo Re-building Maven app for scheduler...
    call mvnw.cmd clean package -pl modules/scheduler -am
) else if "%CONTAINER_NAME%"=="planner-auth" (
    echo Re-building Maven app for auth...
    call mvnw.cmd clean package -pl modules/auth -am
) else (
    echo Error: Unknown container name.
    exit /b 1
)

:: Navigate back to the root directory
cd ..

:: Rebuild the container
echo Rebuilding the container...
docker compose -f schichtconfig/docker/docker-compose.yml build --no-cache %CONTAINER_NAME%

:: Deploy the container
echo Re-deploying the container...
docker compose -f schichtconfig/docker/docker-compose.yml up -d %CONTAINER_NAME%

exit /b 0
