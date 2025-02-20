package com.LIT.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.LIT.auth.utilities.JwtTokenUtil;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class ValidationController {
    private final JwtTokenUtil jwtTokenUtil;

    private final String logHeader = "[ValidationController] - ";

    @Autowired
    public ValidationController(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String token) {
        log.info(logHeader + "validateToken: Validating token");
        //remove "Bearer " prefix before validation
        if (jwtTokenUtil.validateToken(token.substring(7))) {
            return ResponseEntity.ok("Valid token");
        }
        return ResponseEntity.status(401).body("Invalid token");
    }
}
