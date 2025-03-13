package com.LIT.scheduler.service;

import com.LIT.scheduler.exception.ShiftConflictException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.entity.ShiftProposal;
import com.LIT.scheduler.model.enums.ShiftProposalStatus;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;
import com.LIT.scheduler.model.repository.ShiftProposalRepository;
import com.LIT.scheduler.model.repository.ShiftRepository;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ShiftProposalService {

    private final ShiftProposalRepository proposalRepository;
    private final ShiftRepository shiftRepository;
    private final ShiftAssignmentService assignmentService;
    private final ShiftAssignmentRepository assignmentRepository; // For conflict detection.

    private final String logHeader = "[ShiftProposalService] - ";

    @Autowired
    public ShiftProposalService(ShiftProposalRepository proposalRepository,
                                ShiftRepository shiftRepository,
                                ShiftAssignmentService assignmentService,
                                ShiftAssignmentRepository assignmentRepository) {
        this.proposalRepository = proposalRepository;
        this.shiftRepository = shiftRepository;
        this.assignmentService = assignmentService;
        this.assignmentRepository = assignmentRepository;
    }

    // Employee submits new shift proposal (now with conflict detection)
    public ShiftProposal createProposal(ShiftProposal proposal) {
        log.info(logHeader + "createProposal: Creating new shift proposal");

        // Check if there is a conflict with existing official assignments for this specific employee
        LocalDateTime proposedStart = proposal.getProposedStartTime();

        LocalDateTime proposedEnd = proposal.getProposedEndTime();

        log.info(logHeader + "Checking for conflicts with existing official assignments for employee: " + proposal.getEmployeeId() + " from: " + proposedStart + " to: " + proposedEnd);
                
        List<ShiftAssignment> conflicts = assignmentRepository.findConflictingAssignments(proposal.getEmployeeId(), proposedStart, proposedEnd);
        
        if (!conflicts.isEmpty()) {
            log.error(logHeader + "Conflict detected: Employee " + proposal.getEmployeeId() + " has an official assignment overlapping with the proposed shift (" + proposedStart + " to " + proposedEnd + ")");
            throw new ShiftConflictException("Cannot propose shift: The proposed time overlaps with an existing official shift.");
        } else {
            log.info(logHeader + "No conflicts detected for employee " + proposal.getEmployeeId() + " from " + proposedStart + " to " + proposedEnd + ". Proceeding with proposal creation.");
        }
        
        proposal.setStatus(ShiftProposalStatus.PROPOSED);

        proposalRepository.save(proposal);
        log.info(logHeader + "Employee " + proposal.getEmployeeId() + " has proposed a new shift: " + proposal.getProposedTitle() + " from " + proposal.getProposedStartTime() + " to " + proposal.getProposedEndTime());
        
        return proposal;
    }

    // Manager accepts a proposal
    public ShiftProposal acceptProposal(Long proposalId) {
        log.info(logHeader + "Manager is accepting proposal: " + proposalId);

        Optional<ShiftProposal> opt = proposalRepository.findById(proposalId);

        if (!opt.isPresent()) {
            throw new IllegalArgumentException("Shift proposal not found.");
        }

        ShiftProposal proposal = opt.get();

        proposal.setStatus(ShiftProposalStatus.ACCEPTED);

        // Convert proposal to an official shift and create an assignment.
        Shift newShift = Shift.builder()
                .title(proposal.getProposedTitle())
                .startTime(proposal.getProposedStartTime())
                .endTime(proposal.getProposedEndTime())
                .build();
        newShift = shiftRepository.save(newShift);

        log.info(logHeader + "Official shift created: " + newShift.getId() + " from " + newShift.getStartTime() + " to " + newShift.getEndTime() + ".");

        ShiftAssignment assignment = ShiftAssignment.builder()
                .employeeId(proposal.getEmployeeId())
                .shift(newShift)
                .status(com.LIT.scheduler.model.enums.AssignmentStatus.CONFIRMED)
                .build();

        assignmentService.assignShift(assignment);
        log.info(logHeader + "Manager accepted proposal " + proposalId + ". Official shift " + newShift.getId() + " created for employee " + proposal.getEmployeeId() + ".");

        return proposalRepository.save(proposal);
    }

    // Manager rejects a proposal without an alternative
    public ShiftProposal rejectProposal(Long proposalId, String managerComment) {
        log.info(logHeader + "Manager is rejecting proposal " + proposalId + ".");
        Optional<ShiftProposal> opt = proposalRepository.findById(proposalId);

        if (!opt.isPresent()) {
            throw new IllegalArgumentException("Shift proposal not found.");
        }

        ShiftProposal proposal = opt.get();

        proposal.setStatus(ShiftProposalStatus.REJECTED);
        proposal.setManagerComment(managerComment);

        log.info(logHeader + "Manager rejected proposal " + proposalId + " for employee " + proposal.getEmployeeId() + ".");

        return proposalRepository.save(proposal);
    }

    // Manager rejects a proposal and proposes an alternative
    public ShiftProposal proposeAlternative(Long proposalId, ShiftProposal alternativeDetails) {
        log.info(logHeader + "Manager is proposing an alternative for proposal " + proposalId + ".");

        Optional<ShiftProposal> opt = proposalRepository.findById(proposalId);

        if (!opt.isPresent()) {
            throw new IllegalArgumentException("Shift proposal not found.");
        }
        
        ShiftProposal proposal = opt.get();
        
        proposal.setStatus(ShiftProposalStatus.ALTERNATIVE_PROPOSED);
        proposal.setManagerAlternativeTitle(alternativeDetails.getProposedTitle());
        proposal.setManagerAlternativeStartTime(alternativeDetails.getProposedStartTime());
        proposal.setManagerAlternativeEndTime(alternativeDetails.getProposedEndTime());
        proposal.setManagerComment(alternativeDetails.getManagerComment());
        
        log.info(logHeader + "Manager proposed an alternative for proposal " + proposalId + " Alternative shift: " + alternativeDetails.getProposedTitle() + " from: " + alternativeDetails.getProposedStartTime() + " to: " + alternativeDetails.getProposedEndTime() + ".");
        return proposalRepository.save(proposal);
    }

    public List<ShiftProposal> getProposalsByEmployee(Long employeeId) {
        log.info(logHeader + "getProposalsByEmployee: Getting proposals for employee with id: " + employeeId);

        List<ShiftProposal> proposals = proposalRepository.findByEmployeeId(employeeId);
        return proposals;
    }

    public List<ShiftProposal> getAllProposals() {
        log.info(logHeader + "getAllProposals: Getting all proposals");

        List<ShiftProposal> proposals = proposalRepository.findAll();
        return proposals;
    }

    // Report generation for shift proposal
    // CSV
    // I need objectmapper to work for json, but it's not working for some reason.
    public String getProposalsReportCsv() {
        List<ShiftProposal> proposals = proposalRepository.findAll();
        StringBuilder sb = new StringBuilder();
        // CSV header
        sb.append("id,employeeId,employeeName,proposedTitle,proposedStartTime,proposedEndTime,status,managerAlternativeTitle,managerAlternativeStartTime,managerAlternativeEndTime,managerComment\n");
        for (ShiftProposal proposal : proposals) {
            sb.append(proposal.getId()).append(",");
            sb.append(proposal.getEmployeeId()).append(",");
            sb.append("\"").append(proposal.getEmployeeName()).append("\",");
            sb.append("\"").append(proposal.getProposedTitle()).append("\",");
            sb.append(proposal.getProposedStartTime()).append(",");
            sb.append(proposal.getProposedEndTime()).append(",");
            sb.append(proposal.getStatus()).append(",");
            sb.append("\"").append(proposal.getManagerAlternativeTitle() == null ? "" : proposal.getManagerAlternativeTitle()).append("\",");
            sb.append(proposal.getManagerAlternativeStartTime() == null ? "" : proposal.getManagerAlternativeStartTime()).append(",");
            sb.append(proposal.getManagerAlternativeEndTime() == null ? "" : proposal.getManagerAlternativeEndTime()).append(",");
            sb.append("\"").append(proposal.getManagerComment() == null ? "" : proposal.getManagerComment()).append("\"\n");
        }
        log.info(logHeader + "Generated CSV report for shift proposals");
        return sb.toString();
    }


}