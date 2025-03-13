package com.LIT.scheduler.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.service.ShiftAssignmentService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/scheduler/assignments")
@Slf4j
public class ShiftAssignmentController {
    private final ShiftAssignmentService shiftAssignmentService;

    private final String logHeader = "[ShiftAssignmentController] - ";

    @Autowired
    public ShiftAssignmentController(ShiftAssignmentService shiftAssignmentService) {
        this.shiftAssignmentService = shiftAssignmentService;
    }

    // Test JWT -> Button on front-end to check privileges
    @GetMapping("/test-jwt")
    public ResponseEntity<String> testJwt() {
        log.info(logHeader + "testJwt: JWT is working!");
        return ResponseEntity.ok("JWT is working!");
    }

    @GetMapping("/user/{userId}")
    public List<ShiftAssignment> getAssignmentsByUser(@PathVariable Long userId){
        log.info(logHeader + "getAssignmentsByUser: Getting assignments for user with id: " + userId);
        return shiftAssignmentService.getAssignmentsByUserId(userId);
    }

    @GetMapping("/shift/{shiftId}")
    public List<ShiftAssignment> getAssignmentsByShift(@PathVariable Long shiftId) {
        log.info(logHeader + "getAssignmentsByShift: Getting assignments for shift with id: " + shiftId);
        return shiftAssignmentService.getAssignmentsByShift(shiftId);
    }

    @PostMapping
    public ShiftAssignment assignShift(@RequestBody ShiftAssignment assignment) {
        log.info(logHeader + "assignShift: Assigning shift with id: " + assignment.getShift().getId() + " to user with id: " + assignment.getUserId());
        return shiftAssignmentService.assignShift(assignment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeAssignment(@PathVariable Long id) {
        log.info(logHeader + "removeAssignment: Removing assignment with id: " + id);
        shiftAssignmentService.removeAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
