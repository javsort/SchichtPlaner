package com.LIT.auth.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.LIT.auth.model.dto.Req.LoginRequest;
import com.LIT.auth.model.dto.Req.RegisterRequest;
import com.LIT.auth.service.AuthenticationService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    private final String logHeader = "[AuthenticationController] - ";

    @Autowired
    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        log.info(logHeader + "hello: Hello from auth module!");
        return ResponseEntity.ok("Hello from auth module!");
    }

    @GetMapping("/test-jwt")
    public ResponseEntity<String> testJwt() {
        log.info(logHeader + "testJwt: JWT is working!");
        return ResponseEntity.ok("JWT is working!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        log.info(logHeader + "Login request received for user: " + loginRequest.getEmail() + "\nAttempting to log in...");

        Map<String, String> jsonToRet = authenticationService.login(loginRequest);
        log.info(logHeader + "Login request processed for user: " + loginRequest.getEmail() + "\nResponse: " + jsonToRet);

        ResponseEntity<?> response = ResponseEntity.ok(jsonToRet);
        log.info(logHeader + "Response: " + response);

        if (jsonToRet.get("token") == null) {
            
            log.error(logHeader + "Response was null, returning bad request");
            response = ResponseEntity.badRequest().body(response);
        }
        
        log.info(logHeader + "Returning response: " + response);
        return response;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {

        log.info(logHeader + "Register request received for user: " + registerRequest.getEmail() + "\nAttempting to register...");
        authenticationService.register(registerRequest);

        log.info(logHeader + "Register request processed for user: " + registerRequest.getEmail() + "\nUser registered successfully!");
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/dummy-data") // Resets dummy data
    public ResponseEntity<String> resetDummyData() {
        log.info(logHeader + "Resetting dummy data...");
        authenticationService.initializeDummyUsers();

        log.info(logHeader + "Dummy data added!");
        return ResponseEntity.ok("Dummy data added!");
    }
}
