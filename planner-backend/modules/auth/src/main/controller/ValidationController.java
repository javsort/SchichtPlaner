package com.LIT.auth.controller;

import com.LIT.auth.utilities.JwtTokenUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class ValidationController {
    private final JwtTokenUtil jwtTokenUtil;

    public ValidationController(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String token) {
        //remove "Bearer " prefix before validation
        if (jwtTokenUtil.validateToken(token.substring(7))) {
            return ResponseEntity.ok("Valid token");
        }
        return ResponseEntity.status(401).body("Invalid token");
    }
}
