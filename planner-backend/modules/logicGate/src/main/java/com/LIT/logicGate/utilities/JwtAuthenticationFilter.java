package com.LIT.logicGate.utilities;

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

    private final String logHeader = "[JwtAuthenticationFilter] - ";

    @Autowired
    public JwtAuthenticationFilter(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        log.info(logHeader + "doFilterInternal: Filtering request");

        // Since request is moved around, wrap it, and then verify it
        ContentCachingRequestWrapper requestWrap = new ContentCachingRequestWrapper(request);

        log.info(logHeader + "Request: '" + requestWrap.getMethod() + "' " + requestWrap.getRequestURI());

        String authHeader = requestWrap.getHeader("Authorization");

        log.info(logHeader + "Auth header: " + authHeader);
        
        /*
         * Catch cases where there's no token provided -> its either invalid req or user is not logged in
         */
        // Catch the login / registration
        if(authHeader == null) {

            if(requestWrap.getRequestURI().endsWith("/login") || requestWrap.getRequestURI().endsWith("/register") || requestWrap.getRequestURI().endsWith("/hello")) {
                log.info(logHeader + "No token provided, but it's a login / register request -> proceed");

                chain.doFilter(requestWrap, response);
                return;
            }
            
            // If not any of those, then invalid -> reject
            log.error(logHeader + "No token provided, rejecting request");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "No token provided");
            return;
        }

        // there IS a token -> Accessed after system auth -> IN system
        if (authHeader.startsWith("Bearer ")) {
            // Analyze token's validity
            log.info(logHeader + "Token provided, checking validity");

            String token = authHeader.substring(7); //remove "Bearer " prefix

            if (!jwtTokenUtil.validateToken(token)) {
                log.error(logHeader + "Invalid token provided, rejecting request");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                return;
            }

            String userEmail = jwtTokenUtil.extractEmail(token);
            String role = "ROLE_" + jwtTokenUtil.extractRole(token);

            log.info(logHeader + "User: " + userEmail + " has role: " + role);
            log.info(logHeader + "Token is valid, proceeding with request");

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userEmail, null, Collections.singletonList(new SimpleGrantedAuthority(role)));
                    
            SecurityContextHolder.getContext().setAuthentication(authentication);

            requestWrap.setAttribute("userEmail", userEmail);
            requestWrap.setAttribute("role", role);

            log.info(logHeader + "User: " + userEmail + " is authenticated");

            log.info(logHeader + "Request is authenticated, proceeding with request. " + requestWrap.getMethod() + " " + requestWrap.getRequestURI() + " " + requestWrap.getAttributeNames() + " " + requestWrap.getAttribute("userEmail") + " " + requestWrap.getAttribute("role"));

            chain.doFilter(requestWrap, response);

        } else {
            // If not any of those, then invalid -> reject
            log.error(logHeader + "There was an issue reading your token, please try again: '" + authHeader + "'");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "There was an issue reading your token, please try again: '" + authHeader + "'");
            return;
        
        }
    }
}
