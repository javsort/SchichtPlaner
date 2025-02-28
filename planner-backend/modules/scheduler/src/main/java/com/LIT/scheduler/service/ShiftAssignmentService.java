package com.LIT.scheduler.service;

import com.LIT.scheduler.exception.ShiftConflictException;
import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ShiftAssignmentService {
    private static final Logger log = LoggerFactory.getLogger(ShiftAssignmentService.class);
    
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
        
        // extract new shift time details
        Shift newShift = assignment.getShift();
        if (newShift == null) {
            throw new IllegalArgumentException("Shift must be provided for assignment.");
        }
        Timestamp newShiftStart = newShift.getStartTime();
        Timestamp newShiftEnd = newShift.getEndTime();

        // query for conflicting assignments for the same user
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
