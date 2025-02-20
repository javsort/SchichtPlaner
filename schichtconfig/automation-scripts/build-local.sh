#!/bin/bash

cd ../../planner-backend

# Ensure mvnw is executable
chmod +x ./mvnw

./mvnw clean package 