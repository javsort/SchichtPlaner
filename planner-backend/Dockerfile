FROM openjdk:21-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the jar file
#COPY ./testApp/target/testApp-1.0-SNAPSHOT.jar /app/testApp-1.0-SNAPSHOT.jar
COPY modules/testApp/target/testApp-1.0-SNAPSHOT.jar /app/testApp-1.0-SNAPSHOT.jar

# Expose port:
EXPOSE 8080

# Run the jar file
# ENTRYPOINT [ "java", "-jar", "testApp-1.0-SNAPSHOT.jar" ]
CMD ["sh", "-c", "java -jar testApp-1.0-SNAPSHOT.jar"]