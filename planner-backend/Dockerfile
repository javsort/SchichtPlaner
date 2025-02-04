FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the jars
COPY planner-backend/modules/logicGate/target/logicGate-1.0-SNAPSHOT.jar /app/logicGate-1.0-SNAPSHOT.jar

COPY planner-backend/modules/scheduler/target/scheduler-1.0-SNAPSHOT.jar /app/scheduler-1.0-SNAPSHOT.jar

COPY planner-backend/modules/auth/target/auth-1.0-SNAPSHOT.jar /app/auth-1.0-SNAPSHOT.jar

# Expose ports for apps :
EXPOSE 8080 8081 8082

RUN apt-get update && apt-get install -y mariadb-client && apt-get install -y curl

COPY schichtconfig/automation-scripts/jumpstart-backend.sh /app/jumpstart-backend.sh

RUN sed -i 's/\r$//' /app/jumpstart-backend.sh

RUN chmod +x /app/jumpstart-backend.sh

# Run the script
CMD ["sh", "/app/jumpstart-backend.sh"]
