package com.LIT.auth.utilities;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public JwtAuthenticationFilter(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // Since request is moved around, wrap it, and then verify it
        ContentCachingRequestWrapper requestWrap = new ContentCachingRequestWrapper(request);

        log.info("Request: " + requestWrap.getMethod() + " " + requestWrap.getRequestURI());

        String authHeader = requestWrap.getHeader("Authorization");

        log.info("Authorization header: " + authHeader);
        
        /*
         * Catch cases where there's no token provided -> its either invalid req or user is not logged in
         */
        // Catch the login / registration
        if(authHeader == null) {
            if(requestWrap.getRequestURI().equals("/auth/login") || requestWrap.getRequestURI().equals("/auth/register")) {
                chain.doFilter(request, response);
                return;
            }
            
            // If not any of those, then invalid -> reject
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No token provided");
            return;
        }

        // there IS a token -> Accessed after system auth -> IN system
        if (authHeader.startsWith("Bearer ")) {
            // Analyze token's validity
            log.info("Token fulfills basic requirements. Analyzing now the provided tokens: \n'" + authHeader + "'");

            String token = authHeader.substring(7); //remove "Bearer " prefix

            if (!jwtTokenUtil.validateToken(token)) {
                logger.warn("Invalid JWT token");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }

            String userEmail = jwtTokenUtil.extractEmail(token);
            String role = "ROLE_" + jwtTokenUtil.extractRole(token);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userEmail, null, Collections.singletonList(new SimpleGrantedAuthority(role)));
                    
            SecurityContextHolder.getContext().setAuthentication(authentication);


        } else {
            
            // If not any of those, then invalid -> reject
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "There was an issue reading your token, please try again: '" + authHeader + "'");
            return;
        
        }

        chain.doFilter(request, response);
    }
}
