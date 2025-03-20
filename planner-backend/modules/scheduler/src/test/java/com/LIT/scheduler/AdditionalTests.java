package com.LIT.scheduler;

import java.lang.reflect.Field;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import org.springframework.web.client.RestTemplate;

import com.LIT.scheduler.model.dto.AuthUserDTO;
import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.entity.SwapProposal;
import com.LIT.scheduler.model.enums.ShiftProposalStatus;
import com.LIT.scheduler.model.repository.ShiftRepository;
import com.LIT.scheduler.model.repository.SwapProposalRepository;
import com.LIT.scheduler.service.AuthUserService;
import com.LIT.scheduler.service.NotificationService;
import com.LIT.scheduler.service.SwapProposalService;

@ExtendWith(MockitoExtension.class)
public class AdditionalTests {

    @Mock
    private SwapProposalRepository proposalRepository;

    @Mock
    private ShiftRepository shiftRepository;

    @Mock
    private NotificationService notificationService;
    
    // For SwapProposalService we inject a mock AuthUserService.
    @Mock
    private AuthUserService authUserService;

    @InjectMocks
    private SwapProposalService swapProposalService;

    // We'll use this base URL for our integration test.
    private String authServiceBaseUrl = "http://localhost:8081";

    // Test 1: Shift Swap Logic
    @Test
    public void testShiftSwapLogic_SuccessfulSwap() {
        // Prepare a dummy proposal.
        SwapProposal proposal = new SwapProposal();
        proposal.setId(1L);
        proposal.setEmployeeId(1L);
        proposal.setCurrentShiftId(100L);
        proposal.setProposedTitle("Test Shift");
        proposal.setProposedStartTime(LocalDateTime.now().plusDays(1));
        proposal.setProposedEndTime(LocalDateTime.now().plusDays(1).plusHours(1));

        // Prepare the requester's shift (belongs to employee 1).
        Shift requesterShift = new Shift();
        requesterShift.setId(100L);
        requesterShift.setShiftOwnerId(1L);
        requesterShift.setShiftOwnerName("User1");
        requesterShift.setShiftOwnerRole("Role1");

        // Prepare the swap employee's shift (belongs to employee 2).
        Shift swapEmployeeShift = new Shift();
        swapEmployeeShift.setId(200L);
        swapEmployeeShift.setShiftOwnerId(2L);
        swapEmployeeShift.setShiftOwnerName("User2");
        swapEmployeeShift.setShiftOwnerRole("Role2");

        // Mock repository lookups.
        when(shiftRepository.findById(100L)).thenReturn(Optional.of(requesterShift));
        when(shiftRepository.findByShiftOwnerId(2L)).thenReturn(Collections.singletonList(swapEmployeeShift));
        when(proposalRepository.findById(1L)).thenReturn(Optional.of(proposal));
        when(proposalRepository.save(any(SwapProposal.class))).thenReturn(proposal);

        // Provide a dummy email for the employee to avoid NPE.
        when(authUserService.getUserEmailById(1L)).thenReturn("dummy@example.com");

        // Execute the swap acceptance using the proposal id.
        SwapProposal result = swapProposalService.acceptShiftChange(proposal.getId(), 2L);

        // Verify that the proposal was marked accepted.
        assertEquals(ShiftProposalStatus.ACCEPTED, result.getStatus());

        // Verify that the requester shift details were swapped.
        assertEquals(2L, requesterShift.getShiftOwnerId());
        assertEquals("User2", requesterShift.getShiftOwnerName());
        assertEquals("Role2", requesterShift.getShiftOwnerRole());

        // Verify that the swap employee's shift now has the original details.
        assertEquals(1L, swapEmployeeShift.getShiftOwnerId());
        assertEquals("User1", swapEmployeeShift.getShiftOwnerName());
        assertEquals("Role1", swapEmployeeShift.getShiftOwnerRole());
    }

    // Test 2: AuthUserDTO Conversion
    @Test
    public void testAuthUserDTO_Conversion() {
        // Since the AuthUser domain object is in another module, we simply test the DTO directly.
        AuthUserDTO dto = new AuthUserDTO();
        dto.setId(5L);
        dto.setEmail("test@example.com");
        
        // Validate the DTO's getters.
        assertNotNull(dto);
        assertEquals(5L, dto.getId());
        assertEquals("test@example.com", dto.getEmail());
    }

    // Test 3: Email Notification
    @Test
    public void testEmailNotification_SendsEmail() {
        // Define dummy email parameters.
        String recipient = "user@example.com";
        String subject = "Shift Swap Declined";
        String body = "Your shift swap request has been declined. Manager comment: Test comment.";

        // Configure the mock to do nothing when sendEmail is called.
        doNothing().when(notificationService).sendEmail(eq(recipient), eq(subject), eq(body));

        // Invoke the sendEmail method.
        notificationService.sendEmail(recipient, subject, body);

        // Verify that sendEmail was called exactly once with the specified parameters.
        verify(notificationService, times(1)).sendEmail(eq(recipient), eq(subject), eq(body));
    }

    // Test 4: Integration Test for AuthUserService API Call using MockRestServiceServer.
    @Test
    public void testGetUserEmailById_ReturnsEmail() throws Exception {
        // Create a real RestTemplate.
        RestTemplate realRestTemplate = new RestTemplate();
        // Create a real AuthUserService with the real RestTemplate.
        AuthUserService realAuthUserService = new AuthUserService(realRestTemplate);
        
        // Set the authServiceBaseUrl in the AuthUserService instance using reflection.
        Field field = AuthUserService.class.getDeclaredField("authServiceBaseUrl");
        field.setAccessible(true);
        field.set(realAuthUserService, authServiceBaseUrl);
        
        // Create a local MockRestServiceServer for the real RestTemplate.
        MockRestServiceServer localMockServer = MockRestServiceServer.createServer(realRestTemplate);
        
        Long userId = 42L;
        String expectedUrl = authServiceBaseUrl + "/api/auth/users/" + userId;
        String expectedEmail = "testuser@example.com";

        // Prepare a dummy JSON response.
        String jsonResponse = "{\"id\":42, \"email\":\"" + expectedEmail + "\"}";

        // Set up the mock server expectation.
        localMockServer.expect(requestTo(new URI(expectedUrl)))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("X-User-Permissions", "EMPLOYEE_MANAGEMENT"))
                .andRespond(withSuccess(jsonResponse, MediaType.APPLICATION_JSON));

        // Call the method.
        String email = realAuthUserService.getUserEmailById(userId);

        // Verify the email.
        assertEquals(expectedEmail, email);

        // Verify that the mock server received the request.
        localMockServer.verify();
    }

        // Test 5: Decline Shift Change Integration Test
        @Test
        public void testDeclineShiftChange_Integration() {
            // Prepare a dummy proposal.
            SwapProposal proposal = new SwapProposal();
            proposal.setId(5L);
            proposal.setEmployeeId(3L);
            proposal.setCurrentShiftId(10L);
            proposal.setProposedTitle("Test Shift");
            proposal.setProposedStartTime(LocalDateTime.now().plusDays(1));
            proposal.setProposedEndTime(LocalDateTime.now().plusDays(1).plusHours(1));
    
            // Mock repository and service lookups.
            when(proposalRepository.findById(5L)).thenReturn(Optional.of(proposal));
            when(proposalRepository.save(any(SwapProposal.class))).thenReturn(proposal);
            // Ensure the AuthUserService returns a valid email for the proposal initiator.
            when(authUserService.getUserEmailById(3L)).thenReturn("employee@example.com");
    
            String managerComment = "Not available at that time";
    
            // Execute the decline logic.
            SwapProposal result = swapProposalService.declineShiftChange(5L, managerComment);
    
            // Verify that the proposal's status is set to REJECTED and the manager comment is saved.
            assertEquals(ShiftProposalStatus.REJECTED, result.getStatus());
            assertEquals(managerComment, result.getManagerComment());
    
            // Verify that the notification service was invoked.
            // (Assuming that the service sends one email to the proposal initiator.)
            verify(notificationService, times(1)).sendEmail(
                    eq("employee@example.com"),
                    eq("Shift Swap Declined"),
                    org.mockito.ArgumentMatchers.contains(managerComment)
            );
        }    
}
