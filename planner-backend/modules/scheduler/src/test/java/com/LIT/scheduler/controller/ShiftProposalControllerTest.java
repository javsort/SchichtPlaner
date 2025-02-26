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
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static io.restassured.RestAssured.given;
import io.restassured.http.ContentType;
import lombok.extern.slf4j.Slf4j;

@ExtendWith(SpringExtension.class)
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = {
        "spring.datasource.url=jdbc:mariadb://localhost:3306/planner",
        "spring.datasource.username=root",
        "spring.datasource.password=root"
    }
)
@Testcontainers(disabledWithoutDocker = true)
@Slf4j
public class ShiftProposalControllerTest {
    private static final String AUTH_URL = "http://planner-auth:8082/api/auth";
    private static final String LOGIC_GATE_URL = "http://planner-logic-gate:8080/api";
    private static final String DOCKER_NETWORK = "planner-network";

    // private static final String EXTERNAL_DB_URL = "jdbc:mariadb://planner-mariadb:3306/planner";
    private static String EXTERNAL_DB_URL;

    private static MariaDBContainer<?> mariaDB = new MariaDBContainer<>(DockerImageName.parse("mariadb:10.5.5"))
        .withNetworkMode(DOCKER_NETWORK)
        .waitingFor(Wait.forListeningPort());
    
    private static GenericContainer<?> authService = new GenericContainer<>(DockerImageName.parse("schicht-planer-lit-nofront-planner-auth"))
        .withExposedPorts(8084)
        .withNetworkMode(DOCKER_NETWORK);
    
    private static GenericContainer<?> logicGateService = new GenericContainer<>(DockerImageName.parse("schicht-planer-lit-nofront-planner-logic-gate"))
        .withExposedPorts(8085)
        .withNetworkMode(DOCKER_NETWORK);
    
    private String jwtToken;

    @BeforeAll
    static void setUp() {
        mariaDB.start();

        EXTERNAL_DB_URL = mariaDB.getJdbcUrl();
        System.setProperty("spring.datasource.url", EXTERNAL_DB_URL);
        System.setProperty("spring.datasource.username", mariaDB.getUsername());
        System.setProperty("spring.datasource.password", mariaDB.getPassword());
        
        authService
            .withEnv("DB_URL", EXTERNAL_DB_URL)
            .withEnv("DB_USERNAME", mariaDB.getUsername())
            .withEnv("DB_PASSWORD", mariaDB.getPassword());
        
        logicGateService
            .withEnv("DB_URL", EXTERNAL_DB_URL)
            .withEnv("DB_USERNAME", mariaDB.getUsername())
            .withEnv("DB_PASSWORD", mariaDB.getPassword());

        try {
            authService.start();
        } catch (Exception e) {
            System.err.println("AUTH SERVICE FAILED TO START:");
            System.err.println(authService.getLogs());
            throw e;
        }
    
        try {
            logicGateService.start();
        } catch (Exception e) {
            System.err.println("LOGIC GATE SERVICE FAILED TO START:");
            System.err.println(logicGateService.getLogs());
            throw e;
        }
    }

    @AfterAll
    static void tearDown() {
        mariaDB.stop();
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