package com.LIT.statistics.controller;

import com.LIT.statistics.service.ReportsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@Slf4j
public class StatisticsController {

    private final String logHeader = "[StatisticsController] - ";
    private final ReportsService reportsService;

    public StatisticsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        log.info(logHeader + "hello: Hello from statistics module!");
        return ResponseEntity.ok("Hello from statistics module!");
    }

    @GetMapping("/test-jwt")
    public ResponseEntity<String> testJwt() {
        log.info(logHeader + "testJwt: JWT is working!");
        return ResponseEntity.ok("JWT is working!");
    }
    
    @GetMapping("/reports/json")
    public ResponseEntity<String> getReportsJson() {
        log.info(logHeader + "getReportsJson: Generating JSON report");
        String jsonReport = reportsService.getReportsJson();
        return ResponseEntity.ok(jsonReport);
    }
    
    @GetMapping("/reports/csv")
    public ResponseEntity<String> getReportsCsv() {
        log.info(logHeader + "getReportsCsv: Generating CSV report");
        String csvReport = reportsService.getReportsCsv();
        return ResponseEntity.ok(csvReport);
    }
}
