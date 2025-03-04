package com.LIT.statistics.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/stats")
@Slf4j
public class StatisticsController {

    private final String logHeader = "[StatisticsController] - ";

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello from statistics module!");
    }

    @GetMapping("/test-jwt")
    public ResponseEntity<String> testJwt() {
        log.info(logHeader + "testJwt: JWT is working!");
        return ResponseEntity.ok("JWT is working!");
    }
    
}
