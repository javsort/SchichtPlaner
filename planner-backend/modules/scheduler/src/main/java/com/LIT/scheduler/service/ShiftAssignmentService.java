package com.LIT.scheduler.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;

@Service
public class ShiftAssignmentService {
    private final ShiftAssignmentRepository shiftAssignmentRepository;

    @Autowired
    public ShiftAssignmentService(ShiftAssignmentRepository shiftAssignmentRepository) {
        this.shiftAssignmentRepository = shiftAssignmentRepository;
    }

    public List<ShiftAssignment> getAssignmentsByUserId(Long userId) {
        return shiftAssignmentRepository.findByUserId(userId);
    }

    public List<ShiftAssignment> getAssignmentsByShift(Long shiftId) {
        return shiftAssignmentRepository.findByShift(shiftId);
    }

    public ShiftAssignment assignShift(ShiftAssignment assignment) {
        return shiftAssignmentRepository.save(assignment);
    }

    public void removeAssignment(Long id) {
        shiftAssignmentRepository.deleteById(id);
    }
}
