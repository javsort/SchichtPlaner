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

    // Employee submits new shift change request (with conflict detection)
    public ShiftProposal createProposal(ShiftProposal proposal) {
        log.info(logHeader + "createProposal: Creating new shift proposal");
        LocalDateTime proposedStart = proposal.getProposedStartTime();
        LocalDateTime proposedEnd = proposal.getProposedEndTime();
        log.info(logHeader + "Checking for conflicts with existing official assignments for employee: " + proposal.getEmployeeId() + " from: " + proposedStart + " to " + proposedEnd);
        List<ShiftAssignment> conflicts = assignmentRepository.findConflictingAssignments(proposal.getEmployeeId(), proposedStart, proposedEnd);
        if (!conflicts.isEmpty()) {
            log.error(logHeader + "Conflict detected: Employee " + proposal.getEmployeeId() + " has an official assignment overlapping with the proposed shift (" + proposedStart + " to " + proposedEnd + ")");
            throw new ShiftConflictException("Cannot propose shift: The proposed time overlaps with an existing official shift.");
        } else {
            log.info(logHeader + "No conflicts detected for employee " + proposal.getEmployeeId() + " from " + proposedStart + " to " + proposedEnd + ". Proceeding with proposal creation.");
        }
        proposal.setStatus(ShiftProposalStatus.PROPOSED);
        proposalRepository.save(proposal);
        log.info(logHeader + "Employee " + proposal.getEmployeeId() + " has proposed a new shift change request for current shift id " + proposal.getCurrentShiftId() +
                " to new shift: " + proposal.getProposedTitle() + " from " + proposal.getProposedStartTime() + " to " + proposal.getProposedEndTime());
        return proposal;
    }

    // Manager accepts a shift change request, specifying the swap employee id
    public ShiftProposal acceptShiftChange(Long proposalId, Long swapEmployeeId) {
        log.info(logHeader + "Manager is accepting shift change proposal: " + proposalId);
        
        Optional<ShiftProposal> opt = proposalRepository.findById(proposalId);
        if (!opt.isPresent()) {
            throw new IllegalArgumentException("Shift proposal not found.");
        }
        ShiftProposal proposal = opt.get();
        proposal.setStatus(ShiftProposalStatus.ACCEPTED);
    
        // 1. Retrieve User1's assignment (Assignment A) for the shift specified in the proposal
        Optional<ShiftAssignment> optAssignmentA = assignmentRepository.findByUserIdAndShiftId(proposal.getEmployeeId(), proposal.getCurrentShiftId());
        if(optAssignmentA.isEmpty()) {
             throw new RuntimeException("Assignment for user " + proposal.getEmployeeId() + " and shift " + proposal.getCurrentShiftId() + " not found.");
        }
        ShiftAssignment assignmentA = optAssignmentA.get();
        
        // 2. Retrieve User2's assignment (Assignment B) that matches the proposed shift details.
        // We'll find a candidate assignment for swapEmployeeId whose shift start and end times match the proposal.
        List<ShiftAssignment> candidateAssignments = assignmentRepository.findByUserId(swapEmployeeId);
        ShiftAssignment assignmentB = null;
        for(ShiftAssignment sa : candidateAssignments) {
             if(sa.getShift().getStartTime().equals(proposal.getProposedStartTime()) &&
                sa.getShift().getEndTime().equals(proposal.getProposedEndTime())) {
                  assignmentB = sa;
                  break;
             }
        }
        if(assignmentB == null) {
             throw new RuntimeException("No matching assignment found for swap employee " + swapEmployeeId + " with the proposed shift details.");
        }
        
        // 3. Swap the shift references between the two assignments.
        Shift tempShift = assignmentA.getShift();
        assignmentA.setShift(assignmentB.getShift());
        assignmentB.setShift(tempShift);
        
        // 4. Save the updated assignments.
        assignmentRepository.save(assignmentA);
        assignmentRepository.save(assignmentB);
        
        log.info(logHeader + "Manager accepted proposal " + proposalId + ". Shift details swapped: User " + proposal.getEmployeeId() 
                 + " now has shift: " + assignmentA.getShift().getTitle() + ", and user " + swapEmployeeId 
                 + " now has shift: " + assignmentB.getShift().getTitle());
                 
        // Save and return the updated proposal.
        return proposalRepository.save(proposal);
    }
    

    // Manager declines a shift change request
    public ShiftProposal declineShiftChange(Long proposalId, String managerComment) {
        log.info(logHeader + "Manager is declining shift change proposal: " + proposalId);
        Optional<ShiftProposal> opt = proposalRepository.findById(proposalId);
        if (!opt.isPresent()) {
            throw new IllegalArgumentException("Shift proposal not found.");
        }
        ShiftProposal proposal = opt.get();
        proposal.setStatus(ShiftProposalStatus.REJECTED);
        proposal.setManagerComment(managerComment);
        log.info(logHeader + "Manager declined proposal " + proposalId + " for employee " + proposal.getEmployeeId() + " with comment: " + managerComment);
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
}
