package com.LIT.scheduler.mapper;

import com.LIT.scheduler.model.dto.ShiftDTO;
import com.LIT.scheduler.model.entity.Shift;

public class ShiftMapper {

    public static ShiftDTO toDTO(Shift shift) {
        if (shift == null) {
            return null;
        }
        return ShiftDTO.builder()
            .id(shift.getId())
            .title(shift.getTitle())
            .startTime(shift.getStartTime()) // now timestamp
            .endTime(shift.getEndTime())     // now timestamp
            .build();
    }

    public static Shift toEntity(ShiftDTO dto) {
        if (dto == null) {
            return null;
        }
        return Shift.builder()
            .id(dto.getId())
            .title(dto.getTitle())
            .startTime(dto.getStartTime()) // expects a java.sql.Timestamp
            .endTime(dto.getEndTime())     // expects a java.sql.Timestamp
            .build();
    }
}
