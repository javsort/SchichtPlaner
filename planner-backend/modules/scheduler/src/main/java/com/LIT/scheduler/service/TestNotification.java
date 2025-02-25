package com.LIT.scheduler.service;

import java.time.LocalDate;
import java.util.Collections;

import com.LIT.auth.model.entity.User;
import com.LIT.scheduler.model.entity.Shift;

public class TestNotification {

    public static void main(String[] args) {
        // Set up your SMTP configuration (example using Gmail)
        String smtpHost = "smtp.gmail.com";
        int smtpPort = 587;
        String username = "shiftplanner51@gmail.com";
        String password = "VolimoPare0809"; // Use app-specific password if necessary

        // Instantiate the concrete EmailService
        EmailService emailService = new JavaMailEmailService(smtpHost, smtpPort, username, password);

        // Instantiate EmailNotificationService with the EmailService
        EmailNotificationService notificationService = new EmailNotificationService(emailService);

        // Create dummy domain objects for testing:
        User employee = User.builder()
                            .username("John Doe")
                            .email("pekaric.edi1@gmail.com")
                            .build();

        // Simulate a manager user:
        User manager = User.builder()
                           .username("Jane Manager")
                           .email("pekaric.edi1@gmail.com")
                           .build();

        // Create a dummy shift (using startTime and endTime).
        Shift shift = Shift.builder()
                           .title("Test Shift")
                           .startTime(LocalDate.now().plusDays(7).atStartOfDay())
                           .endTime(LocalDate.now().plusDays(7).atTime(17, 0))
                           // Assuming your Shift entity includes assignedEmployees and minimumRequiredEmployees
                           .assignedEmployees(Collections.emptyList())
                           .minimumRequiredEmployees(3)
                           .build();

        // Test sending various notifications
        notificationService.notifyShiftCancelled(employee, shift);
        notificationService.notifyPreferredShiftApproved(employee, shift);
        notificationService.notifyShiftSwapDecision(employee, shift, true);
        notificationService.notifyManagerForShiftShortage(manager, shift);

        // For ShiftScheduler testing, you would need to implement dummy ShiftRepository and ManagerRepository
        // to simulate the retrieval of shifts. This can be done using mocks or stub implementations.
    }
}
