package com.LIT.scheduler.model.entity;

import com.LIT.scheduler.model.enums.ShiftProposalStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "shift_proposals")
public class ShiftProposal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Employee id who created proposal
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    // Proposed shift details by employee
    @Column(nullable = false)
    private String proposedTitle;

    @Column(nullable = false)
    private LocalDateTime proposedStartTime;

    @Column(nullable = false)
    private LocalDateTime proposedEndTime;

    // Proposal status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShiftProposalStatus status;

    // Optional fields for manager alternative proposal
    private String managerAlternativeTitle;
    private LocalDateTime managerAlternativeStartTime;
    private LocalDateTime managerAlternativeEndTime;

    // Optional comment from the manager
    @Column(length = 1024)
    private String managerComment;
}
