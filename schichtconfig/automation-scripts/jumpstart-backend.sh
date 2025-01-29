#!/bin/bash

# Create a logs directory if it doesn't exist
mkdir -p /app/logs

# Start TestApp with prefixed logging
echo "Starting TestApp..." | tee -a /app/logs/testApp.log
java -jar /app/testApp-1.0-SNAPSHOT.jar 2>&1 | sed 's/^/[TestApp] /' | tee -a /app/logs/testApp.log &

# Start SchedulerApp with prefixed logging
echo "Starting SchedulerApp..." | tee -a /app/logs/scheduler.log
java -jar /app/scheduler-1.0-SNAPSHOT.jar 2>&1 | sed 's/^/[Scheduler] /' | tee -a /app/logs/scheduler.log &

# Keep the container running indefinitely to prevent exit
tail -f /dev/null
