package com.LIT.logicGate.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LogicGateController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello from test App!";
    }

    @GetMapping("/cicdtest")
    public String cicdtest() {
        return "Hello from test App! If this endpoint is working, then the CI/CD pipeline is working!";
    }
}
