package com.LIT.scheduler.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;  // <-- now using java.sql.Timestamp 

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "shifts")
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Timestamp startTime;

    @Column(nullable = false)
    private Timestamp endTime;
}
