FROM openjdk:21-jdk-slim

# Install curl + mariadb cli
RUN apt-get update && apt-get install -y mariadb-client && apt-get install -y curl

# Set the working directory
WORKDIR /app

# Copy the jar file
COPY planner-backend/modules/logicGate/target/logicGate-1.0-SNAPSHOT.jar /app/logicGate-1.0-SNAPSHOT.jar

# Expose port:
EXPOSE 8080

ENTRYPOINT [ "java", "-jar", "logicGate-1.0-SNAPSHOT.jar" ]