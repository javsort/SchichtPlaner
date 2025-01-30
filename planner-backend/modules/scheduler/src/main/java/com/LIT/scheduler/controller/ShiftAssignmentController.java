package com.LIT.scheduler.controller;


import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.entity.User;
import com.LIT.scheduler.service.ShiftAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
public class ShiftAssignmentController {
    private final ShiftAssignmentService shiftAssignmentService;

    public ShiftAssignmentController(ShiftAssignmentService shiftAssignmentService) {
        this.shiftAssignmentService = shiftAssignmentService;
    }

    @GetMapping("/user/{userId}")
    public List<ShiftAssignment> getAssignmentsByUser(@PathVariable Long userId) {
        return shiftAssignmentService.getAssignmentsByUser(new User(userId, null, null, null, null));
    }

    @GetMapping("/shift/{shiftId}")
    public List<ShiftAssignment> getAssignmentsByShift(@PathVariable Long shiftId) {
        return shiftAssignmentService.getAssignmentsByShift(new Shift(shiftId, null, null, null));
    }

    @PostMapping
    public ShiftAssignment assignShift(@RequestBody ShiftAssignment assignment) {
        return shiftAssignmentService.assignShift(assignment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeAssignment(@PathVariable Long id) {
        shiftAssignmentService.removeAssignment(id);
        return ResponseEntity.noContent().build();
    }
}

