package com.LIT.scheduler.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LIT.scheduler.exception.ShiftConflictException;
import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ShiftAssignmentService {
    
    private final ShiftAssignmentRepository shiftAssignmentRepository;
    private final NotificationService notificationService;

    private final String logHeader = "[ShiftAssignmentService] - ";

    @Autowired
    public ShiftAssignmentService(ShiftAssignmentRepository shiftAssignmentRepository, NotificationService notificationService) {
        this.shiftAssignmentRepository = shiftAssignmentRepository;
        this.notificationService = notificationService;
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
            log.error(logHeader + "Conflict detected: User " + assignment.getUserId() + " already has an assignment overlapping with the new shift (" + newShiftStart + " - " + newShiftEnd + ").");
            throw new ShiftConflictException("Shift conflict detected: The user has an overlapping assignment.");
        }

        log.info(logHeader + "No conflicts detected. Proceeding to assign shift for user: " + assignment.getUserId());
        return shiftAssignmentRepository.save(assignment);
    }

    public void removeAssignment(Long id) {
        log.info(logHeader + "removeAssignment: Removing assignment with id: " + id);
        Optional<ShiftAssignment> optAssignment = shiftAssignmentRepository.findById(id);
        optAssignment.ifPresent(assignment -> {
            notificationService.sendEmail(
                getEmployeeEmail(assignment.getUserId()),
                "Shift Cancelled",
                "Your shift " + assignment.getShift().getTitle() + " has been cancelled."
            );
        });
        shiftAssignmentRepository.deleteById(id);
    }

    private String getEmployeeEmail(Long employeeId) {
        return "eddie.pekaric@hotmail.com";
    }
}
