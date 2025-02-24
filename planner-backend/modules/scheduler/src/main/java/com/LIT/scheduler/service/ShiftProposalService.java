package com.LIT.scheduler.service;

import com.LIT.scheduler.exception.ShiftConflictException;
import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.entity.ShiftProposal;
import com.LIT.scheduler.model.enums.ShiftProposalStatus;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;
import com.LIT.scheduler.model.repository.ShiftProposalRepository;
import com.LIT.scheduler.model.repository.ShiftRepository;
import lombok.extern.slf4j.Slf4j;
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
        // Check if there is a conflict with existing official assignments for this specific employee
        LocalDateTime proposedStart = proposal.getProposedStartTime();

        LocalDateTime proposedEnd = proposal.getProposedEndTime();

        List<ShiftAssignment> conflicts = assignmentRepository.findConflictingAssignments(
                proposal.getEmployeeId(), proposedStart, proposedEnd);
        
        if (!conflicts.isEmpty()) {
            log.error("Conflict detected: Employee {} has an official assignment overlapping with the proposed shift ({} - {}).",
                    proposal.getEmployeeId(), proposedStart, proposedEnd);

            throw new ShiftConflictException("Cannot propose shift: The proposed time overlaps with an existing official shift.");
        }
        
        proposal.setStatus(ShiftProposalStatus.PROPOSED);
        log.info(logHeader + "Employee {} submitted a shift proposal: {} from {} to {}",
                proposal.getEmployeeId(), proposal.getProposedTitle(), proposedStart, proposedEnd);
        return proposalRepository.save(proposal);
    }

    // Manager accepts a proposal
    public ShiftProposal acceptProposal(Long proposalId) {
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
        ShiftAssignment assignment = ShiftAssignment.builder()
                .userId(proposal.getEmployeeId())
                .shift(newShift)
                .status(com.LIT.scheduler.model.enums.AssignmentStatus.CONFIRMED)
                .build();
        assignmentService.assignShift(assignment);
        log.info(logHeader + "Manager accepted proposal {}. Official shift {} created for employee {}.",
                proposalId, newShift.getId(), proposal.getEmployeeId());
        return proposalRepository.save(proposal);
    }

    // Manager rejects a proposal without an alternative
    public ShiftProposal rejectProposal(Long proposalId, String managerComment) {
        Optional<ShiftProposal> opt = proposalRepository.findById(proposalId);
        if (!opt.isPresent()) {
            throw new IllegalArgumentException("Shift proposal not found.");
        }
        ShiftProposal proposal = opt.get();
        proposal.setStatus(ShiftProposalStatus.REJECTED);
        proposal.setManagerComment(managerComment);
        log.info(logHeader + "Manager rejected proposal {} for employee {}.", proposalId, proposal.getEmployeeId());
        return proposalRepository.save(proposal);
    }

    // Manager rejects a proposal and proposes an alternative
    public ShiftProposal proposeAlternative(Long proposalId, ShiftProposal alternativeDetails) {
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
        log.info(logHeader + "Manager proposed an alternative for proposal {}. Alternative shift: {} from {} to {}.",
                proposalId, alternativeDetails.getProposedTitle(),
                alternativeDetails.getProposedStartTime(), alternativeDetails.getProposedEndTime());
        return proposalRepository.save(proposal);
    }

    public List<ShiftProposal> getProposalsByEmployee(Long employeeId) {
        return proposalRepository.findByEmployeeId(employeeId);
    }

    public List<ShiftProposal> getAllProposals() {
        return proposalRepository.findAll();
    }
}
