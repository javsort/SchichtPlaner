package com.LIT.scheduler.mapper;

import com.LIT.scheduler.model.dto.ShiftAssignmentDTO;
import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftAssignment;

public class ShiftAssignmentMapper {

    public static ShiftAssignmentDTO toDTO(ShiftAssignment assignment) {
        if (assignment == null) {
            return null;
        }
        return ShiftAssignmentDTO.builder()
            .id(assignment.getId())
            .userId(assignment.getUserId())
            .shiftId(assignment.getShift() != null ? assignment.getShift().getId() : null)
            .status(assignment.getStatus())
            .build();
    }

    public static ShiftAssignment toEntity(ShiftAssignmentDTO dto, Shift shift) {
        if (dto == null) {
            return null;
        }
        return ShiftAssignment.builder()
            .id(dto.getId())
            .userId(dto.getUserId())
            .shift(shift)
            .status(dto.getStatus())
            .build();
    }
}

