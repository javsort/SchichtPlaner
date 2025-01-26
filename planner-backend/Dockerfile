FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the jar file
COPY modules/testApp/target/testApp-1.0-SNAPSHOT.jar /app/testApp-1.0-SNAPSHOT.jar
COPY modules/scheduler/target/scheduler-1.0-SNAPSHOT.jar /app/scheduler-1.0-SNAPSHOT.jar

# Expose ports for apps :
EXPOSE 8080 8081

# Copy the startup script
COPY ../automation-scripts/jumpstart-backend.sh /app/jumpstart-backend.sh
RUN chmod +x /app/jumpstart-backend.sh

# Run the script
CMD ["sh", "/app/jumpstart-backend.sh"]