FROM openjdk:21-jdk-slim

# Install curl + mariadb cli
RUN apt-get update && apt-get install -y mariadb-client && apt-get install -y curl

# Set the working directory
WORKDIR /app

# Copy the jar file
COPY planner-backend/modules/scheduler/target/scheduler-1.0-SNAPSHOT.jar /app/scheduler-1.0-SNAPSHOT.jar

# Expose port:
EXPOSE 8080

COPY schichtconfig/automation-scripts/jumpstart-backend.sh /app/jumpstart-backend.sh

RUN sed -i 's/\r$//' /app/jumpstart-backend.sh

RUN chmod +x /app/jumpstart-backend.sh

# Run the script
CMD ["/app/jumpstart-backend.sh", "scheduler"]