package com.LIT.scheduler.model.entity;

import java.time.LocalDateTime;

import com.LIT.scheduler.model.enums.ShiftProposalStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @Column(name = "employee_name", nullable = false)
    private String employeeName;

    @Column(name = "employee_role", nullable = false)
    private String employeeRole;

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