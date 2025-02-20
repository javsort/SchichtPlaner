package com.LIT.scheduler.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;

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
        return shiftAssignmentRepository.save(assignment);
    }

    public void removeAssignment(Long id) {
        log.info(logHeader + "removeAssignment: Removing assignment with id: " + id);
        shiftAssignmentRepository.deleteById(id);
    }
}
