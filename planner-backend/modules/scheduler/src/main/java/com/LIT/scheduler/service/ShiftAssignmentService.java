package com.LIT.scheduler.service;

import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.entity.User;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShiftAssignmentService {
    private final ShiftAssignmentRepository shiftAssignmentRepository;

    public ShiftAssignmentService(ShiftAssignmentRepository shiftAssignmentRepository) {
        this.shiftAssignmentRepository = shiftAssignmentRepository;
    }

    public List<ShiftAssignment> getAssignmentsByUser(User user) {
        return shiftAssignmentRepository.findByUser(user);
    }

    public List<ShiftAssignment> getAssignmentsByShift(Shift shift) {
        return shiftAssignmentRepository.findByShift(shift);
    }

    public ShiftAssignment assignShift(ShiftAssignment assignment) {
        return shiftAssignmentRepository.save(assignment);
    }

    public void removeAssignment(Long id) {
        shiftAssignmentRepository.deleteById(id);
    }
}
