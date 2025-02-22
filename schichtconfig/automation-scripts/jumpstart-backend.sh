#!/bin/bash
set -e

APP_NAME="$1"

# Wait for MariaDB to be ready.
# (Remove this if some services do not need the DB or if you handle waits in docker-compose.)
until mysqladmin ping -h "planner-mariadb" --silent; do
    echo "Waiting for MariaDB to be ready..."
    sleep 2
done

echo "MariaDB is up!"

# Create logs directory if needed
mkdir -p /app/logs

# Decide which JAR to run based on the argument
case "$APP_NAME" in
  "logicGate")
    echo "Starting LogicGate..."
    # Using 'exec' so that the Java process is PID 1 (cleaner Docker container behavior).
    exec java -jar /app/logicGate-1.0-SNAPSHOT.jar \
      2>&1 | sed 's/^/[LogicGate] /' | tee -a /app/logs/logicGate.log
    ;;

  "scheduler")
    echo "Starting SchedulerApp..."
    exec java -jar /app/scheduler-1.0-SNAPSHOT.jar \
      2>&1 | sed 's/^/[Scheduler] /' | tee -a /app/logs/scheduler.log
    ;;

  "auth")
    echo "Starting AuthorizationApp..."
    exec java -jar /app/auth-1.0-SNAPSHOT.jar \
      2>&1 | sed 's/^/[Authorization] /' | tee -a /app/logs/auth.log
    ;;

  "statistics")
    echo "Starting StatisticsApp..."
    exec java -jar /app/statistics-1.0-SNAPSHOT.jar \
      2>&1 | sed 's/^/[Statistics] /' | tee -a /app/logs/statistics.log
    ;;

  *)
    echo "Usage: $0 {logicGate|scheduler|auth}"
    echo "Example: ./start-service.sh logicGate"
    exit 1
    ;;
esac
