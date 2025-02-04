#!/bin/bash


# Wait for MariaDB to be ready
until mysqladmin ping -h "planner-mariadb" --silent; do
    echo "Waiting for MariaDB to be ready..."
    sleep 2
done

echo "MariaDB is up, starting applications..."

# Create a logs directory if it doesn't exist
mkdir -p /app/logs

# Start TestApp with prefixed logging
echo "Starting TestApp..." | tee -a /app/logs/testApp.log
java -jar /app/testApp-1.0-SNAPSHOT.jar 2>&1 | sed 's/^/[TestApp] /' | tee -a /app/logs/testApp.log &

# Start SchedulerApp with prefixed logging
echo "Starting SchedulerApp..." | tee -a /app/logs/scheduler.log
java -jar /app/scheduler-1.0-SNAPSHOT.jar 2>&1 | sed 's/^/[Scheduler] /' | tee -a /app/logs/scheduler.log &

# Start AuthorizationApp with prefixed logging
echo "Starting AuthorizationApp..." | tee -a /app/logs/auth.log
java -jar /app/auth-1.0-SNAPSHOT.jar 2>&1 | sed 's/^/[Authorization] /' | tee -a /app/logs/auth.log &

# Keep the container running indefinitely to prevent exit
tail -f /dev/null
