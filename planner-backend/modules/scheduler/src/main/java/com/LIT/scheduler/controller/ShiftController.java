package com.LIT.scheduler.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.service.ShiftService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth/shifts")
@Slf4j
public class ShiftController {
    private final ShiftService shiftService;

    private final String logHeader = "[ShiftController] - ";

    @Autowired
    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @GetMapping("/hello")
    public String hello() {
        log.info(logHeader + "hello: Hello from scheduler module!");
        return "Hello from scheduler module!";
    }

    @GetMapping
    public List<Shift> getAllShifts() {
        log.info(logHeader + "getAllShifts: Getting all shifts");
        return shiftService.getAllShifts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shift> getShiftById(@PathVariable Long id) {
        log.info(logHeader + "getShiftById: Getting shift with id: " + id);
        Optional<Shift> shift = shiftService.getShiftById(id);
        return shift.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Shift createShift(@RequestBody Shift shift) {
        log.info(logHeader + "createShift: Creating new shift");
        return shiftService.saveShift(shift);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shift> updateShift(@PathVariable Long id, @RequestBody Shift shift) {
        log.info(logHeader + "updateShift: Updating shift with id: " + id);
        try {
            Shift updatedShift = shiftService.updateShift(id, shift);
            log.info(logHeader + "updateShift: Shift updated successfully");
            return ResponseEntity.ok(updatedShift);

        } catch (RuntimeException ex) {
            log.error(logHeader + "updateShift: " + ex.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {
        log.info(logHeader + "deleteShift: Deleting shift with id: " + id);
        shiftService.deleteShift(id);
        return ResponseEntity.noContent().build();
    }
}
