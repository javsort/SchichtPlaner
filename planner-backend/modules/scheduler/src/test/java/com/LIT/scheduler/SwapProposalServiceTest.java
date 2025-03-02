package com.LIT.scheduler;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftAssignment;
import com.LIT.scheduler.model.entity.SwapProposal;
import com.LIT.scheduler.model.enums.ShiftProposalStatus;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;
import com.LIT.scheduler.model.repository.SwapProposalRepository;
import com.LIT.scheduler.service.SwapProposalService;

@ExtendWith(MockitoExtension.class)
public class SwapProposalServiceTest {

    @Mock
    private SwapProposalRepository proposalRepository;

    @Mock
    private ShiftAssignmentRepository assignmentRepository;

    @InjectMocks
    private SwapProposalService swapProposalService;

    @BeforeEach
    public void setup() {
    }

    @Test
    public void testCreateProposal_NoConflict() {
        SwapProposal proposal = new SwapProposal();
        proposal.setEmployeeId(1L);
        proposal.setCurrentShiftId(10L);
        proposal.setProposedTitle("Test Shift");
        proposal.setProposedStartTime(LocalDateTime.now().plusHours(1));
        proposal.setProposedEndTime(LocalDateTime.now().plusHours(2));

        // Simulate that no conflicting assignments exist.
        when(assignmentRepository.findConflictingAssignments(eq(1L), any(), any()))
                .thenReturn(Collections.emptyList());

        // Simulate repository saving the proposal.
        when(proposalRepository.save(any(SwapProposal.class))).thenReturn(proposal);

        SwapProposal result = swapProposalService.createProposal(proposal);
        assertNotNull(result);
        assertEquals(ShiftProposalStatus.PROPOSED, result.getStatus());
    }

    @Test
    public void testGetAllProposals() {
        SwapProposal proposal1 = new SwapProposal();
        proposal1.setEmployeeId(1L);
        SwapProposal proposal2 = new SwapProposal();
        proposal2.setEmployeeId(2L);

        List<SwapProposal> proposals = Arrays.asList(proposal1, proposal2);
        when(proposalRepository.findAll()).thenReturn(proposals);

        List<SwapProposal> result = swapProposalService.getAllProposals();
        assertEquals(2, result.size());
    }

    @Test
    public void testGetProposalsByEmployee() {
        SwapProposal proposal = new SwapProposal();
        proposal.setEmployeeId(1L);
        List<SwapProposal> proposals = Collections.singletonList(proposal);
        when(proposalRepository.findByEmployeeId(1L)).thenReturn(proposals);

        List<SwapProposal> result = swapProposalService.getProposalsByEmployee(1L);
        assertEquals(1, result.size());
    }

    @Test
    public void testDeclineShiftChange() {
        SwapProposal proposal = new SwapProposal();
        proposal.setEmployeeId(1L);
        proposal.setCurrentShiftId(10L);
        proposal.setProposedTitle("Test Shift");

        when(proposalRepository.findById(100L)).thenReturn(Optional.of(proposal));
        when(proposalRepository.save(any(SwapProposal.class))).thenReturn(proposal);

        String managerComment = "Not a good time.";
        SwapProposal result = swapProposalService.declineShiftChange(100L, managerComment);
        assertEquals(ShiftProposalStatus.REJECTED, result.getStatus());
        assertEquals(managerComment, result.getManagerComment());
    }

    @Test
    public void testAcceptShiftChange_NoConflict() {
        SwapProposal proposal = new SwapProposal();
        proposal.setEmployeeId(1L);
        proposal.setCurrentShiftId(100L);
        proposal.setProposedTitle("Test Shift");
        proposal.setProposedStartTime(LocalDateTime.now().plusDays(1));
        proposal.setProposedEndTime(LocalDateTime.now().plusDays(1).plusHours(1));

        when(proposalRepository.findById(200L)).thenReturn(Optional.of(proposal));

        // Prepare assignment for swap employee B (matching proposed details).
        Shift shiftB = new Shift();
        shiftB.setId(2L);
        shiftB.setTitle("Test Shift");
        shiftB.setStartTime(proposal.getProposedStartTime());
        shiftB.setEndTime(proposal.getProposedEndTime());
        ShiftAssignment assignmentB = new ShiftAssignment();
        assignmentB.setId(2L);
        assignmentB.setShift(shiftB);

        List<ShiftAssignment> swapUserAssignments = Collections.singletonList(assignmentB);
        when(assignmentRepository.findByUserId(10L)).thenReturn(swapUserAssignments);
        when(assignmentRepository.findConflictingAssignments(eq(10L), any(), any()))
                .thenReturn(Collections.emptyList());

        // Prepare assignment A for the original employee.
        Shift shiftA = new Shift();
        shiftA.setId(3L);
        shiftA.setTitle("Original Shift");
        shiftA.setStartTime(LocalDateTime.now());
        shiftA.setEndTime(LocalDateTime.now().plusHours(1));
        ShiftAssignment assignmentA = new ShiftAssignment();
        assignmentA.setId(1L);
        assignmentA.setShift(shiftA);

        when(assignmentRepository.findByUserIdAndShiftId(1L, 100L))
                .thenReturn(Optional.of(assignmentA));
        // Ensure swap employee does not already have assignment for shift A.
        when(assignmentRepository.findByUserIdAndShiftId(10L, shiftA.getId()))
                .thenReturn(Optional.empty());

        // Simulate saving of proposal and assignments.
        when(proposalRepository.save(any(SwapProposal.class))).thenReturn(proposal);
        when(assignmentRepository.save(any(ShiftAssignment.class))).thenReturn(assignmentA);

        SwapProposal result = swapProposalService.acceptShiftChange(200L, 10L);
        assertEquals(ShiftProposalStatus.ACCEPTED, result.getStatus());
    }
}
