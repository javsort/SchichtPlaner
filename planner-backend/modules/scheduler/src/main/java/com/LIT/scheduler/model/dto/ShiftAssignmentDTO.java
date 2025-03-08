package com.LIT.scheduler.model.dto;

import com.LIT.scheduler.model.enums.AssignmentStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftAssignmentDTO {
    private Long id;
    private Long userId;
    private Long shiftId;
    private AssignmentStatus status;
    private String username;
}

