package com.LIT.scheduler.service;

import com.LIT.scheduler.exception.ShiftConflictException;
import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class ShiftAssignmentService {
    private final ShiftAssignmentRepository shiftAssignmentRepository;

    public ShiftAssignmentService(ShiftAssignmentRepository shiftAssignmentRepository) {
        this.shiftAssignmentRepository = shiftAssignmentRepository;
    }

    public List<ShiftAssignment> getAssignmentsByUserId(Long userId) {
        return shiftAssignmentRepository.findByUserId(userId);
    }

    public List<ShiftAssignment> getAssignmentsByShift(Long shiftId) {
        return shiftAssignmentRepository.findByShiftId(shiftId);
    }

    public ShiftAssignment assignShift(ShiftAssignment assignment) {
        // Extract time details of new shift
        Shift newShift = assignment.getShift();
        if (newShift == null) {
            throw new IllegalArgumentException("Shift must be provided for assignment.");
        }
        LocalDateTime newShiftStart = newShift.getStartTime();
        LocalDateTime newShiftEnd = newShift.getEndTime();

        // Query for conflicting assignments for the same user.
        List<ShiftAssignment> conflicts = shiftAssignmentRepository.findConflictingAssignments(
                assignment.getUserId(), newShiftStart, newShiftEnd);

        if (!conflicts.isEmpty()) {
            log.error("Conflict detected: User {} already has an assignment overlapping with the new shift ({} - {}).",
                    assignment.getUserId(), newShiftStart, newShiftEnd);
            throw new ShiftConflictException("Shift conflict detected: The user has an overlapping assignment.");
        }

        log.info("No conflicts detected. Proceeding to assign shift for user {}.", assignment.getUserId());
        return shiftAssignmentRepository.save(assignment);
    }

    public void removeAssignment(Long id) {
        shiftAssignmentRepository.deleteById(id);
    }

    
}
