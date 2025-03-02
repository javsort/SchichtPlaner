package com.LIT.scheduler.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LIT.auth.service.UserService;
import com.LIT.scheduler.exception.ShiftConflictException;
import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.entity.SwapProposal;
import com.LIT.scheduler.model.enums.ShiftProposalStatus;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;
import com.LIT.scheduler.model.repository.SwapProposalRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SwapProposalService {

    private final SwapProposalRepository proposalRepository;
    private final ShiftAssignmentRepository assignmentRepository; // For conflict detection.
    private final NotificationService notificationService;
    private final UserService userService;
    private final String logHeader = "[ShiftProposalService] - ";

    @Autowired
    public SwapProposalService(SwapProposalRepository proposalRepository,
                                ShiftAssignmentRepository assignmentRepository,
                                NotificationService notificationService,
                                UserService userService) {
        this.proposalRepository = proposalRepository;
        this.assignmentRepository = assignmentRepository;
        this.notificationService = notificationService;
        this.userService = userService;
    }

    // Employee submits new shift change request (with conflict detection)
    public SwapProposal createProposal(SwapProposal proposal) {
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
    public SwapProposal acceptShiftChange(Long proposalId, Long swapEmployeeId) {
        log.info(logHeader + "Manager is accepting shift change proposal: " + proposalId);
        
        // Retrieve the proposal.
        Optional<SwapProposal> opt = proposalRepository.findById(proposalId);
        
        if (!opt.isPresent()) {
            throw new IllegalArgumentException("Shift proposal not found.");
        }
        
        SwapProposal proposal = opt.get();
        
        // Retrieve all assignments for the swap employee.
        List<ShiftAssignment> swapUserAssignments = assignmentRepository.findByUserId(swapEmployeeId);
        
        // Find a candidate assignment for the swap employee whose shift details match the proposed target details.
        Optional<ShiftAssignment> optAssignmentB = swapUserAssignments.stream()
            .filter(assignment ->
                assignment.getShift().getTitle().equals(proposal.getProposedTitle()) &&
                assignment.getShift().getStartTime().equals(proposal.getProposedStartTime()) &&
                assignment.getShift().getEndTime().equals(proposal.getProposedEndTime())
            )
            .findFirst();
        
        if (!optAssignmentB.isPresent()) {
             throw new RuntimeException("No matching assignment found for swap employee " + swapEmployeeId + " with the proposed shift details.");
        }
        
        ShiftAssignment assignmentB = optAssignmentB.get();
        
        // Additional conflict check: Ensure that aside from the candidate assignment, 
        // the swap employee has no other assignments overlapping with the target shift's time window.
        List<ShiftAssignment> newUserConflicts = assignmentRepository.findConflictingAssignments(
                swapEmployeeId, assignmentB.getShift().getStartTime(), assignmentB.getShift().getEndTime());
        // Exclude the candidate assignment from the conflict check.
        newUserConflicts = newUserConflicts.stream()
                .filter(a -> !a.getId().equals(assignmentB.getId()))
                .toList();
        
        
        if (!newUserConflicts.isEmpty()) {
            String conflictMsg = "Conflict detected: New user " + swapEmployeeId + " has overlapping assignment(s)";
            log.error(logHeader + conflictMsg);
            throw new ShiftConflictException(conflictMsg);
        }
        
        // Retrieve the requesting user's assignment (Assignment A) for the shift to be swapped.
        Optional<ShiftAssignment> optAssignmentA = assignmentRepository.findByUserIdAndShiftId(proposal.getEmployeeId(), proposal.getCurrentShiftId());
        
        if (optAssignmentA.isEmpty()) {
             throw new RuntimeException("Assignment for user " + proposal.getEmployeeId() + " and shift " + proposal.getCurrentShiftId() + " not found.");
        }
        ShiftAssignment assignmentA = optAssignmentA.get();

        // **** Enhanced Check ****
        // Ensure that the swap employee does NOT already have an assignment for the shift being swapped away from (Assignment A).
        Optional<ShiftAssignment> duplicateAssignment = assignmentRepository.findByUserIdAndShiftId(swapEmployeeId, assignmentA.getShift().getId());
        if (duplicateAssignment.isPresent()) {
            String conflictMsg = "Swap conflict: Employee " + swapEmployeeId + " already has an assignment for shift " + assignmentA.getShift().getTitle();
            log.error(logHeader + conflictMsg);
            throw new ShiftConflictException(conflictMsg);
        }
        
        // At this point, all conflict checks have passed.
        // Mark the proposal as accepted.
        proposal.setStatus(ShiftProposalStatus.ACCEPTED);
        
        // Swap the shift references between the two assignments.
        Shift tempShift = assignmentA.getShift();
        
        assignmentA.setShift(assignmentB.getShift());
        assignmentB.setShift(tempShift);
        
        // Save the updated assignments.
        assignmentRepository.save(assignmentA);
        assignmentRepository.save(assignmentB);
        
        log.info(logHeader + "Manager accepted proposal " + proposalId + ". Shift swap executed: User " + proposal.getEmployeeId() +
                 " now has shift: " + assignmentA.getShift().getTitle() + ", and user " + swapEmployeeId +
                 " now has shift: " + assignmentB.getShift().getTitle());
        
        // Send email notification to the employee who initiated the swap.
        notificationService.sendEmail(
            getEmployeeEmail(proposal.getEmployeeId()),
            "Shift Swap Accepted",
            "Your shift swap request has been accepted. Your new shift is: " + assignmentA.getShift().getTitle()
        );
        return proposalRepository.save(proposal);
    }
    
    // Manager declines a shift change request
    public SwapProposal declineShiftChange(Long proposalId, String managerComment) {
        log.info(logHeader + "Manager is declining shift change proposal: " + proposalId);
        
        Optional<SwapProposal> opt = proposalRepository.findById(proposalId);
        
        if (!opt.isPresent()) {
            throw new IllegalArgumentException("Shift proposal not found.");
        }
        
        SwapProposal proposal = opt.get();
        
        proposal.setStatus(ShiftProposalStatus.REJECTED);
        proposal.setManagerComment(managerComment);
        
        log.info(logHeader + "Manager declined proposal " + proposalId + " for employee " + proposal.getEmployeeId() + " with comment: " + managerComment);
        
        notificationService.sendEmail(
            getEmployeeEmail(proposal.getEmployeeId()),
            "Shift Swap Declined",
            "Your shift swap request has been declined. Manager comment: " + managerComment
        );

        return proposalRepository.save(proposal);
    }

    public List<SwapProposal> getProposalsByEmployee(Long employeeId) {
        log.info(logHeader + "getProposalsByEmployee: Getting proposals for employee with id: " + employeeId);
        
        List<SwapProposal> proposals = proposalRepository.findByEmployeeId(employeeId);
        
        return proposals;
    }

    public List<SwapProposal> getAllProposals() {
        log.info(logHeader + "getAllProposals: Getting all proposals");
        
        List<SwapProposal> proposals = proposalRepository.findAll();
        
        return proposals;
    }

    private String getEmployeeEmail(Long employeeId) {
        return "eddie.pekaric@hotmail.com"; // Hardcoded as all of the mails are not real mails
        //return userService.getUserById(employeeId)
        //                  .map(User::getEmail)
        //                  .orElse("eddie.pekaric@hotmail.com");
    }
}
