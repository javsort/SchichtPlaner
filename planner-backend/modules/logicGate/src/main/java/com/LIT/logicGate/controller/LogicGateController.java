package com.LIT.logicGate.controller;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.ContentCachingRequestWrapper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/api")
@Slf4j
public class LogicGateController {

    private final String logHeader = "[LogicGateController] - ";

    /*
     * Addresses
     */
    private RestTemplate restTemplate;

    @Value("${address.auth.url}")
    private String authUrl;

    @Value("${address.scheduler.url}")
    private String schedulerUrl;

    @Value("${address.stats.url}")
    private String statsUrl;

    @Autowired
    public LogicGateController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    @GetMapping("/hello")
    public String hello() {
        log.info(logHeader + "hello: Hello from logicGate module!");
        return "Hello from logicGate module!";
    }

    @GetMapping("/test")
    public String test() {
        log.info(logHeader + "test: Test from logicGate module! JWT is working!");
        return "Test from logicGate module! JWT is working!";
    }

    /*
     * Authentication endpoints
     *
    @PostMapping("/auth/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok();
    }

    @PostMapping("/auth/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
    }*/
    
    
    /*
     * Forward endpoints
     */
    @RequestMapping("/auth/**")
    public ResponseEntity<?> forwardToAuth(HttpServletRequest request, @RequestBody(required = false) String requestBody) {
        log.info(logHeader + "Forwarding request to auth: " + request.getRequestURI());
        
        if(requestBody != null){
            log.info(logHeader + "Forwarding request to Auth with the following body: " + requestBody);    
        }

        String targetUrl = authUrl + request.getRequestURI();
        log.info(logHeader + "Target url: " + targetUrl);

        return forwardGate(request, targetUrl, requestBody, "Auth");

    }

    @RequestMapping("/scheduler/**")
    public ResponseEntity<?> forwardToScheduler(HttpServletRequest request, @RequestBody(required = false) String requestBody) {
        log.info(logHeader + "Forwarding request to scheduler: " + request.getRequestURI());

        String targetUrl = schedulerUrl + request.getRequestURI();
        
        log.info(logHeader + "Target url: " + targetUrl);
        return forwardGate(request, targetUrl, requestBody, "Scheduler");

    }

    @RequestMapping("/stats/**")
    public ResponseEntity<?> forwardToStats(HttpServletRequest request, @RequestBody(required = false) String requestBody) {

        log.info(logHeader + "Forwarding request to statistics: " + request.getRequestURI());
        String targetUrl = statsUrl + request.getRequestURI();

        log.info(logHeader + "Target url: " + targetUrl);
        return forwardGate(request, targetUrl, requestBody, "Statistics");

    }

    
    public ResponseEntity<?> forwardGate(HttpServletRequest request, String targetUrl, String requestBody, String destinationModule){
        log.info(logHeader + "Forwarding request to " + destinationModule + "\nTarget url: " + targetUrl + "\nWith the body: " + requestBody);

        ContentCachingRequestWrapper requestWrap = new ContentCachingRequestWrapper(request);
        
        log.info(logHeader + "Request is authenticated, proceeding with request. " + requestWrap.getMethod() + " " + requestWrap.getRequestURI() + " " + requestWrap.getAttributeNames() + " " + requestWrap.getAttribute("userEmail") + " " + requestWrap.getAttribute("role"));

        HttpHeaders headers = getHeaders(requestWrap);

        log.info(logHeader + "Request is being sent to: '" + targetUrl + "'\nProtocol: " + request.getMethod() + "\nHeaders: " + headers + "\nBody: " + requestBody + "\n");
        

        // Add the role as attribute for the request -> turn into header
        String role = (String) requestWrap.getAttribute("role");
        if(role != null){
            headers.set("X-User-Role", role);
        }
        
        // Form entity to send for the request
        HttpEntity<?> httpEntity = new HttpEntity<>(requestBody, headers);

        // Forward the request
        try {

            ResponseEntity<String> response = restTemplate.exchange(
                targetUrl,
                HttpMethod.valueOf(request.getMethod()),
                httpEntity,
                String.class
            );

            log.info(logHeader + "Response from '" + destinationModule + "': " + response.getBody());
    
            return new ResponseEntity<>(response.getBody(), response.getStatusCode());
            
        } catch (Exception e) {
            log.error(logHeader + "An error occurred while forwarding the request: " + e.getMessage());
            return ResponseEntity.status(500).body("An error occurred while forwarding the request.");

        }
    }

    public HttpHeaders getHeaders(HttpServletRequest request) {
        HttpHeaders headers = new HttpHeaders();

        Collections.list(request.getHeaderNames())
            .forEach(headerName -> headers.add(headerName, request.getHeader(headerName)));
        headers.setContentType(MediaType.APPLICATION_JSON);

        return headers;
    }
}