package com.LIT.testApp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/testApp")
public class TestAppController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello from test App!";
    }
}
