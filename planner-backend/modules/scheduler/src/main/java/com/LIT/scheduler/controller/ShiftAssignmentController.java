package com.LIT.scheduler.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/shiftAssignment")
public class ShiftAssignmentController {
    @GetMapping("/heartbeat")
    public String heartbeat() {
        return "ShiftAssignmentController is alive!";
    }

}
