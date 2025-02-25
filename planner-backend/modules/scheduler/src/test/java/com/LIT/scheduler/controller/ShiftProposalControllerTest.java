    package com.LIT.scheduler.controller;

    import static org.hamcrest.Matchers.equalTo;
    import org.junit.jupiter.api.AfterAll;
    import org.junit.jupiter.api.BeforeAll;
    import org.junit.jupiter.api.BeforeEach;
    import org.junit.jupiter.api.Test;
    import org.junit.jupiter.api.extension.ExtendWith;
    import org.springframework.boot.test.context.SpringBootTest;
    import org.springframework.test.context.junit.jupiter.SpringExtension;
    import org.testcontainers.containers.GenericContainer;
    import org.testcontainers.utility.DockerImageName;

import static io.restassured.RestAssured.given;
import io.restassured.http.ContentType;

    @ExtendWith(SpringExtension.class)
    @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
    public class ShiftProposalControllerTest {

        private static final String AUTH_URL = "http://planner-auth:8082/api/auth";
        private static final String LOGIC_GATE_URL = "http://planner-logic-gate:8080/api";

        private static final String DOCKER_NETWORK = "planner-network";
        private static final String EXTERNAL_DB_URL = "jdbc:mariadb://planner-mariadb:3306/planner";

        private static GenericContainer<?> authService = new GenericContainer<>(DockerImageName.parse("schicht-planer-lit-nofront-planner-auth"))
            .withExposedPorts(8082)
            .withNetworkMode(DOCKER_NETWORK)
            .withEnv("DB_URL", EXTERNAL_DB_URL)
            .withEnv("DB_USER", "planner")
            .withEnv("DB_PASSWORD", "root");

        private static GenericContainer<?> logicGateService = new GenericContainer<>(DockerImageName.parse("schicht-planer-lit-nofront-planner-logic-gate"))
            .withExposedPorts(8080)
            .withNetworkMode(DOCKER_NETWORK) // Attach to the same network
            .withEnv("AUTH_SERVICE_HOST", "planner-auth") // Reference auth service by name
            .withEnv("AUTH_SERVICE_PORT", "8081");

        private String jwtToken;

        @BeforeAll
        static void setUp() {
            authService.start();
            logicGateService.start();
        }

        @AfterAll
        static void tearDown() {
            authService.stop();
            logicGateService.stop();
        }

        @BeforeEach
        void authenticateAndGetJwt() {
            // Login to get JWT
            jwtToken = given()
                    .contentType(ContentType.JSON)
                    .body("{\"email\": \"admin@example.com\", \"password\": \"admin123\"}")
                    .when()
                    .post(LOGIC_GATE_URL + "/api/auth/login")
                    .then()
                    .statusCode(200)
                    .extract().jsonPath().getString("token");
        }

        @Test
        void testAccessToProtectedRoute() {
            given()
                    .header("Authorization", jwtToken)
                    .when()
                    .get(LOGIC_GATE_URL + "/test")
                    .then()
                    .statusCode(200)
                    .body(equalTo("Test from logicGate module! JWT is working!"));
        }

        @Test
        void testUnauthorizedAccess() {
            given()
                    .when()
                    .get(LOGIC_GATE_URL + "/test")
                    .then()
                    .statusCode(401);
        }   
    }