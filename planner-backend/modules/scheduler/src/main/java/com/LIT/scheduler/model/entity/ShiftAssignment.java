package com.LIT.scheduler.model.entity;

import com.LIT.scheduler.model.enums.AssignmentStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "shift_assignments")
public class ShiftAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Store the employee/user ID as a simple column
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "shift_id", nullable = false)
    private Shift shift;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssignmentStatus status;
}