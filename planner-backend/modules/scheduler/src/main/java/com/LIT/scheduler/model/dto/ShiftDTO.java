package com.LIT.scheduler.model.dto;

import java.sql.Timestamp;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftDTO {
    private Long id;
    private String title;
    private Timestamp startTime;
    private Timestamp endTime;
}
