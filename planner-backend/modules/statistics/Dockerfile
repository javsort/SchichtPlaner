FROM openjdk:21-jdk-slim

# Install curl + mariadb cli
RUN apt-get update && apt-get install -y mariadb-client && apt-get install -y curl

# Set the working directory
WORKDIR /app

# Copy the jar file
COPY planner-backend/modules/statistics/target/statistics-1.0-SNAPSHOT.jar /app/statistics-1.0-SNAPSHOT.jar

# Expose port:
EXPOSE 8083

ENTRYPOINT [ "java", "-jar", "statistics-1.0-SNAPSHOT.jar" ]