#!/bin/bash


# Wait for MariaDB to be ready
until mysqladmin ping -h "planner-mariadb" --silent; do
    echo "Waiting for MariaDB to be ready..."
    sleep 2
done

echo "MariaDB is up, starting applications..."

# Create a logs directory if it doesn't exist
mkdir -p /app/logs

# Start LogicGate with prefixed logging
echo "Starting LogicGate..." | tee -a /app/logs/logicGate.log
java -jar /app/logicGate-1.0-SNAPSHOT.jar 2>&1 | sed 's/^/[logicGate] /' | tee -a /app/logs/logicGate.log &

# Start SchedulerApp with prefixed logging
echo "Starting SchedulerApp..." | tee -a /app/logs/scheduler.log
java -jar /app/scheduler-1.0-SNAPSHOT.jar 2>&1 | sed 's/^/[Scheduler] /' | tee -a /app/logs/scheduler.log &

# Start AuthorizationApp with prefixed logging
echo "Starting AuthorizationApp..." | tee -a /app/logs/auth.log
java -jar /app/auth-1.0-SNAPSHOT.jar 2>&1 | sed 's/^/[Authorization] /' | tee -a /app/logs/auth.log &

# Keep the container running indefinitely to prevent exit
tail -f /dev/null
