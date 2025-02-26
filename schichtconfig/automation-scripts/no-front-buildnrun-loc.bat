@echo off

setlocal

cd ../../planner-backend

call mvnw.cmd clean package -DskipTests

cd ../schichtconfig/docker

call docker compose -f docker-compose-no-front.yml build --no-cache

call docker compose -f docker-compose-no-front.yml up