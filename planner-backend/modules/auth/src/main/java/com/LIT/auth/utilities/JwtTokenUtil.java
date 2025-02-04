package com.LIT.auth.utilities;

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

    private static final long EXPIRATION_TIME = 3600000; // 1 hour

    public String generateToken(String email, String role) {

        
        return JWT.create()
                .withIssuer("LIT - auth0")
                .withSubject(email)
                .withClaim("userEmail", email)
                .withClaim("role", role)
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(secret));
    }

    public String extractEmail(String token) {
        return JWT.decode(token).getClaim("userEmail").asString();
    }

    public String extractRole(String token) {
        return JWT.decode(token).getClaim("role").asString();
    }

    public boolean validateToken(String token) {
        try {
            JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
            return true;

        } catch (Exception e) {
            return false;
        }
    }
}
