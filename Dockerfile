# -----------------------------
# Stage 1: Build the WAR
# -----------------------------
FROM maven:3.9.11-eclipse-temurin-21 AS build

WORKDIR /app

# Copy only pom first to leverage layer caching for dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -B

# Copy project sources
COPY src ./src

# Build WAR (skip tests for faster builds; remove -DskipTests in CI if you want tests)
RUN mvn clean package -DskipTests -B

# -----------------------------
# Stage 2: Run the WAR
# -----------------------------
FROM eclipse-temurin:21-jre-ubi9-minimal

# non-root runtime user (optional but recommended)
# create user and use it to run the app
RUN microdnf update -y && microdnf clean all  true
RUN useradd --create-home appuser  true
USER appuser
WORKDIR /home/appuser/app

# Copy WAR from build stage. Use the exact name if you prefer for safety.
COPY --from=build /app/target/*.war app.war

# Optional: allow passing extra JVM options at runtime
ENV JAVA_OPTS=""

# Expose the port your app listens on (metadata only)
ARG APP_PORT=8082
ENV SERVER_PORT=${APP_PORT}
EXPOSE ${APP_PORT}

# Use exec form and allow JAVA_OPTS injection
ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar app.war"]
