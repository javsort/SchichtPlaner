package com.LIT.statistics.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftReportDTO {
    private Long employeeId;
    private String employeeName;
    private Long totalShifts;
    private Long weekendShifts;
    private Long lateShifts;
}