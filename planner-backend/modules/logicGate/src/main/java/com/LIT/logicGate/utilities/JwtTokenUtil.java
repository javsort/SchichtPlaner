package com.LIT.logicGate.utilities;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtTokenUtil {

    @Value("${jwt.secret}")
    private String secret;

    private String logHeader = "[JwtTokenUtil] - ";

    private static final long EXPIRATION_TIME = 3600000; // 1 hour

    public String generateToken(String email, String role, Long userId, String username) {
        log.info(logHeader + "generateToken: Generating token for user: " + email);        
        return JWT.create()
                .withIssuer("LIT - auth0")
                .withSubject(email)
                .withClaim("userEmail", email)
                .withClaim("role", role)
                .withClaim("userName", username)
                .withClaim("userId", userId)
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(secret));
    }

    public String extractEmail(String token) {
        log.info(logHeader + "extractEmail: Extracting email from token");
        return JWT.decode(token).getClaim("userEmail").asString();
    }

    public String extractRole(String token) {
        log.info(logHeader + "extractRole: Extracting role from token");
        return JWT.decode(token).getClaim("role").asString();
    }

    public Long extractUserId(String token) {
        log.info(logHeader + "extractUserId: Extracting userId from token");
        return JWT.decode(token).getClaim("userId").asLong();
    }

    public String extractUsername(String token) {
        log.info(logHeader + "extractUsername: Extracting username from token");
        return JWT.decode(token).getClaim("userName").asString();
    }

    public boolean validateToken(String token) {
        log.info(logHeader + "validateToken: Validating token");
        try {
            JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
            log.info(logHeader + "Token is valid");
            return true;

        } catch (Exception e) {
            log.error(logHeader + "Token is invalid");
            return false;
        }
    }
}
