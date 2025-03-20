package com.LIT.scheduler.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.LIT.scheduler.model.dto.AuthUserDTO;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthUserService {

    private final RestTemplate restTemplate;
    
    // Inject the auth service base URL from your YAML configuration
    @Value("${address.auth.url}")
    private String authServiceBaseUrl;

    public AuthUserService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getUserEmailById(Long userId) {
        // Use the correct endpoint; here we assume the auth service exposes /api/auth/users/{userId}
        String url = authServiceBaseUrl + "/api/auth/users/" + userId;
        log.debug("[AuthUserService] - Constructed URL: {}", url);

        // Set the header to a value allowed by the auth service.
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-User-Permissions", "EMPLOYEE_MANAGEMENT"); // Have the correct permissions
        log.debug("[AuthUserService] - Headers being sent: {}", headers);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<AuthUserDTO> response = restTemplate.exchange(url, HttpMethod.GET, entity, AuthUserDTO.class);
            log.debug("[AuthUserService] - Response received: {} with body: {}", response.getStatusCode(), response.getBody());
            if(response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String email = response.getBody().getEmail();
                log.debug("[AuthUserService] - Extracted email: {}", email);
                return email;
            } else {
                log.error("[AuthUserService] - Non-successful response: {} with body: {}", response.getStatusCode(), response.getBody());
            }
        } catch(Exception ex) {
            log.error("[AuthUserService] - Exception occurred while calling auth service: ", ex);
        }
        throw new RuntimeException("Unable to retrieve user email for user id: " + userId);
    }
}
