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
import com.LIT.scheduler.model.entity.SwapProposal;
import com.LIT.scheduler.model.enums.ShiftProposalStatus;
import com.LIT.scheduler.model.repository.ShiftRepository;
import com.LIT.scheduler.model.repository.SwapProposalRepository;
import com.LIT.scheduler.service.AuthUserService;
import com.LIT.scheduler.service.NotificationService;
import com.LIT.scheduler.service.SwapProposalService;

@ExtendWith(MockitoExtension.class)
public class SwapProposalServiceTest {

    @Mock
    private SwapProposalRepository proposalRepository;

    @Mock
    private ShiftRepository shiftRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private AuthUserService authUserService;

    @InjectMocks
    private SwapProposalService swapProposalService;

    @BeforeEach
    public void setup() {
        // No fallback code is present now in the service.
    }

    @Test
    public void testCreateProposal_NoConflict() {
        SwapProposal proposal = new SwapProposal();
        proposal.setEmployeeId(1L);
        proposal.setCurrentShiftId(10L);
        proposal.setProposedTitle("Test Shift");
        proposal.setProposedStartTime(LocalDateTime.now().plusHours(1));
        proposal.setProposedEndTime(LocalDateTime.now().plusHours(2));

        // Simulate that no conflicting shifts exist.
        when(shiftRepository.findConflictingShifts(eq(1L), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(Collections.emptyList());

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
        when(authUserService.getUserEmailById(1L)).thenReturn("user@example.com");

        String managerComment = "Not a good time.";
        SwapProposal result = swapProposalService.declineShiftChange(100L, managerComment);
        assertEquals(ShiftProposalStatus.REJECTED, result.getStatus());
        assertEquals(managerComment, result.getManagerComment());
    }

    @Test
    public void testAcceptShiftChange_NoConflict() {
        // Prepare a proposal
        SwapProposal proposal = new SwapProposal();
        proposal.setEmployeeId(1L);
        proposal.setCurrentShiftId(100L);
        proposal.setProposedTitle("Test Shift");
        proposal.setProposedStartTime(LocalDateTime.now().plusDays(1));
        proposal.setProposedEndTime(LocalDateTime.now().plusDays(1).plusHours(1));

        when(proposalRepository.findById(200L)).thenReturn(Optional.of(proposal));

        // Prepare swap employee's shift (the target shift for the swap)
        Shift swapEmployeeShift = new Shift();
        swapEmployeeShift.setId(2L);
        swapEmployeeShift.setTitle("Test Shift");
        swapEmployeeShift.setStartTime(proposal.getProposedStartTime());
        swapEmployeeShift.setEndTime(proposal.getProposedEndTime());
        // When shiftRepository.findByShiftOwnerId is called with swapEmployeeId (10L), return a list with swapEmployeeShift.
        when(shiftRepository.findByShiftOwnerId(10L)).thenReturn(Collections.singletonList(swapEmployeeShift));

        // Prepare the requester's shift
        Shift requesterShift = new Shift();
        requesterShift.setId(100L);
        requesterShift.setTitle("Original Shift");
        requesterShift.setStartTime(LocalDateTime.now());
        requesterShift.setEndTime(LocalDateTime.now().plusHours(1));
        when(shiftRepository.findById(100L)).thenReturn(Optional.of(requesterShift));

        // For authUserService, provide dummy emails for the original employee and the swap employee.
        when(authUserService.getUserEmailById(1L)).thenReturn("user1@example.com");
        when(authUserService.getUserEmailById(swapEmployeeShift.getShiftOwnerId())).thenReturn("userSwap@example.com");

        when(proposalRepository.save(any(SwapProposal.class))).thenReturn(proposal);

        SwapProposal result = swapProposalService.acceptShiftChange(200L, 10L);
        assertEquals(ShiftProposalStatus.ACCEPTED, result.getStatus());
    }
}
