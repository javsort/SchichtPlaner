@echo off

setlocal

cd ../../planner-backend

call mvnw.cmd clean package 

cd ../schichtconfig/docker

call docker-compose -f docker-compose.yml build --no-cache

call docker-compose -f docker-compose.yml up