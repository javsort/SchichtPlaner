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
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.ShiftProposal;
import com.LIT.scheduler.model.enums.ShiftProposalStatus;
import com.LIT.scheduler.model.repository.ShiftAssignmentRepository;
import com.LIT.scheduler.model.repository.ShiftProposalRepository;
import com.LIT.scheduler.model.repository.ShiftRepository;
import com.LIT.scheduler.service.AuthUserService;
import com.LIT.scheduler.service.NotificationService;
import com.LIT.scheduler.service.ShiftAssignmentService;
import com.LIT.scheduler.service.ShiftProposalService;

@ExtendWith(MockitoExtension.class)
public class ShiftProposalServiceTest {

    @Mock
    private ShiftProposalRepository proposalRepository;

    @Mock
    private ShiftRepository shiftRepository;

    @Mock
    private ShiftAssignmentRepository assignmentRepository;

    @Mock
    private ShiftAssignmentService assignmentService; // If used in your methods

    @Mock
    private AuthUserService authUserService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ShiftProposalService proposalService;

    private ShiftProposal sampleProposal;

    @BeforeEach
    public void setUp() {
        sampleProposal = ShiftProposal.builder()
                .id(100L)
                .employeeId(3L)
                // Removed currentShiftId because it's not defined in the entity
                .proposedTitle("Morning Shift")
                .proposedStartTime(LocalDateTime.of(2025, 3, 25, 7, 0))
                .proposedEndTime(LocalDateTime.of(2025, 3, 25, 15, 0))
                .status(ShiftProposalStatus.PROPOSED)
                .employeeName("Technician")
                .employeeRole("Technician")
                .build();
    }

    @Test
    public void testCreateProposal_NoConflict() {
        // Assume no conflict exists.
        when(assignmentRepository.findConflictingAssignments(eq(3L), any(LocalDateTime.class), any(LocalDateTime.class)))
            .thenReturn(Collections.emptyList());
        when(proposalRepository.save(any(ShiftProposal.class))).thenReturn(sampleProposal);

        ShiftProposal created = proposalService.createProposal(sampleProposal, "ROLE_Technician", "Technician", 3L);

        assertNotNull(created);
        assertEquals(ShiftProposalStatus.PROPOSED, created.getStatus());
        assertEquals("Technician", created.getEmployeeName());
        // Verify that the repository was called.
        verify(proposalRepository, times(1)).save(sampleProposal);
    }

    @Test
    public void testUpdateProposal_Success() {
        ShiftProposal updatedProposal = ShiftProposal.builder()
                .proposedTitle("Updated Shift")
                .proposedStartTime(LocalDateTime.of(2025, 3, 25, 8, 0))
                .proposedEndTime(LocalDateTime.of(2025, 3, 25, 16, 0))
                .build();

        when(proposalRepository.findById(100L)).thenReturn(Optional.of(sampleProposal));
        when(proposalRepository.save(any(ShiftProposal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ShiftProposal result = proposalService.updateProposal(100L, updatedProposal);
        assertNotNull(result);
        assertEquals("Updated Shift", result.getProposedTitle());
    }

    @Test
    public void testCancelProposal_Success() {
        when(proposalRepository.findById(100L)).thenReturn(Optional.of(sampleProposal));
        when(proposalRepository.save(any(ShiftProposal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ShiftProposal canceled = proposalService.cancelProposal(100L);
        assertNotNull(canceled);
        assertEquals(ShiftProposalStatus.CANCELLED, canceled.getStatus());
    }

    @Test
    public void testAcceptProposal_Success() {
        // For acceptProposal, we assume the proposal is found.
        when(proposalRepository.findById(100L)).thenReturn(Optional.of(sampleProposal));
        
        // Create a new Shift from proposal details.
        Shift newShift = Shift.builder()
                .id(200L)
                .shiftOwnerId(sampleProposal.getEmployeeId())
                .title(sampleProposal.getProposedTitle())
                .shiftOwnerName(sampleProposal.getEmployeeName())
                .shiftOwnerRole(sampleProposal.getEmployeeRole())
                .startTime(sampleProposal.getProposedStartTime())
                .endTime(sampleProposal.getProposedEndTime())
                .build();
                
        when(shiftRepository.save(any(Shift.class))).thenReturn(newShift);
        when(proposalRepository.save(any(ShiftProposal.class))).thenAnswer(invocation -> invocation.getArgument(0));
        
        ShiftProposal accepted = proposalService.acceptProposal(100L);
        assertNotNull(accepted);
        assertEquals(ShiftProposalStatus.ACCEPTED, accepted.getStatus());
    }

    @Test
    public void testRejectProposal_Success() {
        when(proposalRepository.findById(100L)).thenReturn(Optional.of(sampleProposal));
        when(proposalRepository.save(any(ShiftProposal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String comment = "Not feasible";
        ShiftProposal rejected = proposalService.rejectProposal(100L, comment);
        assertNotNull(rejected);
        assertEquals(ShiftProposalStatus.REJECTED, rejected.getStatus());
        assertEquals(comment, rejected.getManagerComment());
    }

    @Test
    public void testProposeAlternative_Success() {
        when(proposalRepository.findById(100L)).thenReturn(Optional.of(sampleProposal));
        when(proposalRepository.save(any(ShiftProposal.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ShiftProposal alternative = ShiftProposal.builder()
                .proposedTitle("Alternative Shift")
                .proposedStartTime(LocalDateTime.of(2025, 3, 25, 8, 0))
                .proposedEndTime(LocalDateTime.of(2025, 3, 25, 16, 0))
                .managerComment("Please try alternative time")
                .build();

        ShiftProposal altResult = proposalService.proposeAlternative(100L, alternative);
        assertNotNull(altResult);
        assertEquals(ShiftProposalStatus.ALTERNATIVE_PROPOSED, altResult.getStatus());
        assertEquals("Alternative Shift", altResult.getManagerAlternativeTitle());
        assertEquals("Please try alternative time", altResult.getManagerComment());
    }

    @Test
    public void testGetProposalsByEmployee() {
        when(proposalRepository.findByEmployeeId(3L)).thenReturn(Arrays.asList(sampleProposal));
        List<ShiftProposal> proposals = proposalService.getProposalsByEmployee(3L);
        assertNotNull(proposals);
        assertEquals(1, proposals.size());
    }

    @Test
    public void testGetAllProposals() {
        when(proposalRepository.findAll()).thenReturn(Arrays.asList(sampleProposal));
        List<ShiftProposal> proposals = proposalService.getAllProposals();
        assertNotNull(proposals);
        assertEquals(1, proposals.size());
    }
}
