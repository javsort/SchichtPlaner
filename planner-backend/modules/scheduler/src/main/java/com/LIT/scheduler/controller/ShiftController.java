package com.LIT.scheduler.controller;

import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.service.ShiftService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/shifts")
public class ShiftController {
    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    @GetMapping
    public List<Shift> getAllShifts() {
        return shiftService.getAllShifts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shift> getShiftById(@PathVariable Long id) {
        Optional<Shift> shift = shiftService.getShiftById(id);
        return shift.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Shift createShift(@RequestBody Shift shift) {
        return shiftService.saveShift(shift);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shift> updateShift(@PathVariable Long id, @RequestBody Shift shift) {
        try {
            Shift updatedShift = shiftService.updateShift(id, shift);
            return ResponseEntity.ok(updatedShift);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {
        shiftService.deleteShift(id);
        return ResponseEntity.noContent().build();
    }
}
