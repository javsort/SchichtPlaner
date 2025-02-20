package com.LIT.scheduler.service;

import com.LIT.scheduler.exception.ShiftConflictException;
import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.entity.ShiftProposal;
import com.LIT.scheduler.model.enums.ShiftProposalStatus;
import com.LIT.scheduler.model.repository.ShiftProposalRepository;
import com.LIT.scheduler.model.repository.ShiftRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ShiftProposalService {
    private final ShiftProposalRepository proposalRepository;
    private final ShiftRepository shiftRepository;
    private final ShiftAssignmentService assignmentService;

    public ShiftProposalService(ShiftProposalRepository proposalRepository,
                                ShiftRepository shiftRepository,
                                ShiftAssignmentService assignmentService) {
        this.proposalRepository = proposalRepository;
        this.shiftRepository = shiftRepository;
        this.assignmentService = assignmentService;
    }

    // Proposal by Employee
    public ShiftProposal createProposal(ShiftProposal proposal) {
        proposal.setStatus(ShiftProposalStatus.PROPOSED);
        log.info("Employee {} submitted a shift proposal: {} from {} to {}",
                proposal.getEmployeeId(), proposal.getProposedTitle(),
                proposal.getProposedStartTime(), proposal.getProposedEndTime());
        return proposalRepository.save(proposal);
    }

    // Manager accepts proposal
    public ShiftProposal acceptProposal(Long proposalId) {
        Optional<ShiftProposal> opt = proposalRepository.findById(proposalId);
        if (!opt.isPresent()) {
            throw new IllegalArgumentException("Shift proposal not found.");
        }
        ShiftProposal proposal = opt.get();
        proposal.setStatus(ShiftProposalStatus.ACCEPTED);
        // Create official shift based on proposal
        Shift newShift = Shift.builder()
                .title(proposal.getProposedTitle())
                .startTime(proposal.getProposedStartTime())
                .endTime(proposal.getProposedEndTime())
                .build();
        newShift = shiftRepository.save(newShift);
        // Create shift assignment for employee
        ShiftAssignment assignment = ShiftAssignment.builder()
                .userId(proposal.getEmployeeId())
                .shift(newShift)
                .status(com.LIT.scheduler.model.enums.AssignmentStatus.CONFIRMED)
                .build();
        assignmentService.assignShift(assignment);
        log.info("Manager accepted proposal {}. Official shift {} created for employee {}.",
                proposalId, newShift.getId(), proposal.getEmployeeId());
        return proposalRepository.save(proposal);
    }

    // Manager rejects proposal 
    public ShiftProposal rejectProposal(Long proposalId, String managerComment) {
        Optional<ShiftProposal> opt = proposalRepository.findById(proposalId);
        if (!opt.isPresent()) {
            throw new IllegalArgumentException("Shift proposal not found.");
        }
        ShiftProposal proposal = opt.get();
        proposal.setStatus(ShiftProposalStatus.REJECTED);
        proposal.setManagerComment(managerComment);
        log.info("Manager rejected proposal {} for employee {}.", proposalId, proposal.getEmployeeId());
        return proposalRepository.save(proposal);
    }

    // Manager rejects proposal but proposes alternative
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
        log.info("Manager proposed an alternative for proposal {}. Alternative shift: {} from {} to {}.",
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
