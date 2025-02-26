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
        log.info(logHeader + "Attempting to update assignment: shifting assignment for shift id {} from user {} to user {}", shiftId, currentUserId, newUserId);
        
        Optional<ShiftAssignment> optionalAssignment = shiftAssignmentRepository.findByUserIdAndShiftId(currentUserId, shiftId);
        if (optionalAssignment.isEmpty()) {
            String errorMsg = "Shift assignment not found for user " + currentUserId + " and shift " + shiftId;
            log.error(logHeader + errorMsg);
            throw new RuntimeException(errorMsg);
        }
        
        ShiftAssignment assignment = optionalAssignment.get();
        /*
        // Optional: Check for conflicting assignments for the new user
        List<ShiftAssignment> newUserConflicts = shiftAssignmentRepository.findConflictingAssignments(
            newUserId, assignment.getShift().getStartTime(), assignment.getShift().getEndTime());
        if (!newUserConflicts.isEmpty()) {
            String conflictMsg = "Conflict detected: New user " + newUserId + " has overlapping assignment(s)";
            log.error(logHeader + conflictMsg);
            throw new ShiftConflictException(conflictMsg);
        }
        */
        
        assignment.setUserId(newUserId);
        
        try {
            ShiftAssignment updatedAssignment = shiftAssignmentRepository.save(assignment);
            log.info(logHeader + "Successfully updated assignment. New assignment: " + updatedAssignment);
            return updatedAssignment;
        } catch (Exception e) {
            log.error(logHeader + "Error saving updated assignment: " + e.getMessage());
            throw new RuntimeException("Error saving updated assignment: " + e.getMessage());
        }
    }    
}
