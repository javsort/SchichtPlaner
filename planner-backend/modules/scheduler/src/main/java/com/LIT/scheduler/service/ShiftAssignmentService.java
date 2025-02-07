package com.LIT.scheduler.service;

import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
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
        return shiftAssignmentRepository.save(assignment);
    }

    public void removeAssignment(Long id) {
        shiftAssignmentRepository.deleteById(id);
    }
}
