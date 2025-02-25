package com.LIT.scheduler.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;
import com.LIT.scheduler.exception.ShiftConflictException;
import com.LIT.scheduler.model.entity.Shift;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ShiftAssignmentService {
    
    private final ShiftAssignmentRepository shiftAssignmentRepository;
    private final String logHeader = "[ShiftAssignmentService] - ";

    @Autowired
    public ShiftAssignmentService(ShiftAssignmentRepository shiftAssignmentRepository) {
        this.shiftAssignmentRepository = shiftAssignmentRepository;
    }

    public List<ShiftAssignment> getAssignmentsByUserId(Long userId) {
        log.info(logHeader + "getAssignmentsByUserId: Getting assignments for user with id: " + userId);
        return shiftAssignmentRepository.findByUserId(userId);
    }

    public List<ShiftAssignment> getAssignmentsByShift(Long shiftId) {
        log.info(logHeader + "getAssignmentsByShift: Getting assignments for shift with id: " + shiftId);
        return shiftAssignmentRepository.findByShiftId(shiftId);
    }

    public ShiftAssignment assignShift(ShiftAssignment assignment) {
        log.info(logHeader + "assignShift: Assigning shift with id: " + assignment.getShift().getId() + " to user with id: " + assignment.getUserId());
        Shift newShift = assignment.getShift();
        if (newShift == null) {
            throw new IllegalArgumentException("Shift must be provided for assignment.");
        }
        LocalDateTime newShiftStart = newShift.getStartTime();
        LocalDateTime newShiftEnd = newShift.getEndTime();
        List<ShiftAssignment> conflicts = shiftAssignmentRepository.findConflictingAssignments(
                assignment.getUserId(), newShiftStart, newShiftEnd);
        if (!conflicts.isEmpty()) {
            log.error("Conflict detected: User {} already has an assignment overlapping with the new shift ({} - {}).",
                    assignment.getUserId(), newShiftStart, newShiftEnd);
            throw new ShiftConflictException("Shift conflict detected: The user has an overlapping assignment.");
        }
        log.info(logHeader + "No conflicts detected. Proceeding to assign shift for user {}.", assignment.getUserId());
        return shiftAssignmentRepository.save(assignment);
    }

    public void removeAssignment(Long id) {
        log.info(logHeader + "removeAssignment: Removing assignment with id: " + id);
        shiftAssignmentRepository.deleteById(id);
    }
    
    // Update assignment to swap shift to a new employee
    public ShiftAssignment updateAssignmentForSwap(Long currentUserId, Long shiftId, Long newUserId) {
        log.info(logHeader + "updateAssignmentForSwap: Updating assignment for shift id: " + shiftId + " from user " + currentUserId + " to new user " + newUserId);
        Optional<ShiftAssignment> optionalAssignment = shiftAssignmentRepository.findByUserIdAndShiftId(currentUserId, shiftId);
        if (optionalAssignment.isEmpty()) {
            throw new RuntimeException("Shift assignment not found for user " + currentUserId + " and shift " + shiftId);
        }
        ShiftAssignment assignment = optionalAssignment.get();
        assignment.setUserId(newUserId);
        return shiftAssignmentRepository.save(assignment);
    }
}
