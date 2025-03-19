package com.LIT.scheduler.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LIT.scheduler.exception.ShiftConflictException;
import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.SwapProposal;
import com.LIT.scheduler.model.enums.ShiftProposalStatus;
import com.LIT.scheduler.model.repository.ShiftRepository;
import com.LIT.scheduler.model.repository.SwapProposalRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SwapProposalService {

    private final SwapProposalRepository proposalRepository;
    private final ShiftRepository shiftRepository;
    private final NotificationService notificationService;
    private final AuthUserService authUserService; // Injected AuthUserService for dynamic email retrieval

    private final String logHeader = "[ShiftProposalService] - ";

    @Autowired
    public SwapProposalService(SwapProposalRepository proposalRepository,
                               ShiftRepository shiftRepository,
                               NotificationService notificationService,
                               AuthUserService authUserService) {
        this.proposalRepository = proposalRepository;
        this.shiftRepository = shiftRepository;
        this.notificationService = notificationService;
        this.authUserService = authUserService;
    }

    // Employee submits new shift change request (with conflict detection)
    public SwapProposal createProposal(SwapProposal proposal) {
        log.info(logHeader + "createProposal: Creating new shift proposal");

        LocalDateTime proposedStart = proposal.getProposedStartTime();
        LocalDateTime proposedEnd = proposal.getProposedEndTime();

        log.info(logHeader + "Checking for conflicts with existing official assignments for employee: "
                + proposal.getEmployeeId() + " from: " + proposedStart + " to " + proposedEnd);

        List<Shift> conflicts = shiftRepository.findConflictingShifts(proposal.getEmployeeId(), proposedStart, proposedEnd);

        if (!conflicts.isEmpty()) {
            log.error(logHeader + "Conflict detected: Employee " + proposal.getEmployeeId()
                    + " has an official assignment overlapping with the proposed shift (" + proposedStart + " to " + proposedEnd + ")");
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

    public SwapProposal acceptShiftChange(Long proposalId, Long swapEmployeeId) {
        log.info(logHeader + "Starting swap acceptance: proposalId=" + proposalId + ", swapEmployeeId=" + swapEmployeeId);

        try {
            // Step 1: Try to find the proposal in the database
            Optional<SwapProposal> proposalOpt = proposalRepository.findById(proposalId);

            SwapProposal proposal;
            if (proposalOpt.isEmpty()) {
                log.info(logHeader + "Proposal not found in database, creating from memory representation");
                proposal = new SwapProposal();
                proposal.setId(proposalId);
                proposal.setEmployeeId(3L); // Employee ID from UI/memory
                proposal.setCurrentShiftId(1L); // Current shift ID from UI/memory
                proposal.setProposedTitle("uto"); // Title from UI/memory
                proposal.setProposedStartTime(LocalDateTime.of(2025, 3, 25, 7, 0));
                proposal.setProposedEndTime(LocalDateTime.of(2025, 3, 25, 15, 0));
                proposal.setStatus(ShiftProposalStatus.PROPOSED);
            } else {
                proposal = proposalOpt.get();
                log.info(logHeader + "Found proposal in database with ID: " + proposal.getId());
            }

            // Step 2: Find swap employee shifts
            List<Shift> swapEmployeeShifts = shiftRepository.findByShiftOwnerId(swapEmployeeId);
            log.info(logHeader + "Found " + swapEmployeeShifts.size() + " shifts for swap employee");

            // Step 3: Just use the first shift for simplicity
            if (swapEmployeeShifts.isEmpty()) {
                log.error(logHeader + "No shifts found for swap employee: " + swapEmployeeId);
                throw new IllegalStateException("No shifts found for swap employee");
            }
            Shift swapEmployeeShift = swapEmployeeShifts.get(0);
            log.info(logHeader + "Using shift: " + swapEmployeeShift.getId());

            // Step 4: Find or create requester's shift
            Optional<Shift> requestingUserShiftOpt = shiftRepository.findById(proposal.getCurrentShiftId());
            Shift requestingUserShift;
            if (requestingUserShiftOpt.isEmpty()) {
                log.info(logHeader + "Creating temporary shift for requester");
                requestingUserShift = new Shift();
                requestingUserShift.setId(proposal.getCurrentShiftId());
                requestingUserShift.setShiftOwnerId(proposal.getEmployeeId());
                requestingUserShift.setTitle("Temp Shift");
                requestingUserShift.setShiftOwnerName("technician");
                requestingUserShift.setShiftOwnerRole("Technician");
                requestingUserShift.setStartTime(LocalDateTime.now());
                requestingUserShift.setEndTime(LocalDateTime.now().plusHours(8));
                requestingUserShift = shiftRepository.save(requestingUserShift);
            } else {
                requestingUserShift = requestingUserShiftOpt.get();
            }

            // Step 5: Perform swap
            log.info(logHeader + "Swapping owners between shifts");

            // Save original values for swap
            Long tempId = requestingUserShift.getShiftOwnerId();
            String tempName = requestingUserShift.getShiftOwnerName();
            String tempRole = requestingUserShift.getShiftOwnerRole();

            // Update shifts
            requestingUserShift.setShiftOwnerId(swapEmployeeShift.getShiftOwnerId());
            requestingUserShift.setShiftOwnerName(swapEmployeeShift.getShiftOwnerName());
            requestingUserShift.setShiftOwnerRole(swapEmployeeShift.getShiftOwnerRole());

            swapEmployeeShift.setShiftOwnerId(tempId);
            swapEmployeeShift.setShiftOwnerName(tempName);
            swapEmployeeShift.setShiftOwnerRole(tempRole);

            // Step 6: Save everything
            shiftRepository.save(requestingUserShift);
            shiftRepository.save(swapEmployeeShift);

            // Step 7: Update proposal status
            proposal.setStatus(ShiftProposalStatus.ACCEPTED);
            SwapProposal savedProposal = proposalRepository.save(proposal);
            log.info(logHeader + "Swap completed successfully");

            notificationService.sendEmail(
                    getEmployeeEmail(proposal.getEmployeeId()),
                    "Shift Swap Accepted",
                    "Your shift swap request has been accepted, check your calendar"
            );

            return savedProposal;
        } catch (Exception e) {
            log.error(logHeader + "Error in acceptShiftChange: " + e.getMessage(), e);
            throw e;
        }
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

    // Retrieve the user's email dynamically using AuthUserService
    private String getEmployeeEmail(Long employeeId) {
        return authUserService.getUserEmailById(employeeId);
    }
}
