package com.LIT.scheduler.service;

import com.LIT.auth.model.entity.User;
import com.LIT.scheduler.model.entity.Shift;

/**
 * Provides methods to send notification emails for various events.
 */
public class EmailNotificationService {

    private final EmailService emailService;

    public EmailNotificationService(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Notifies a user that their shift has been cancelled.
     */
    public void notifyShiftCancelled(User user, Shift shift) {
        String subject = "Shift Cancelled";
        String message = String.format(
            "Dear %s,\n\nYour shift on %s has been cancelled.\n\nRegards,\nShift Planner",
            user.getUsername(), shift.getStartTime()
        );
        emailService.sendEmail(user.getEmail(), subject, message);
    }

    /**
     * Notifies a user that their preferred shift has been approved.
     */
    public void notifyPreferredShiftApproved(User user, Shift shift) {
        String subject = "Preferred Shift Approved";
        String message = String.format(
            "Dear %s,\n\nYour preferred shift on %s has been approved.\n\nRegards,\nShift Planner",
            user.getUsername(), shift.getStartTime()
        );
        emailService.sendEmail(user.getEmail(), subject, message);
    }

    /**
     * Notifies a user about the outcome of a shift swap request.
     * @param accepted true if the swap was accepted, false if declined.
     */
    public void notifyShiftSwapDecision(User user, Shift shift, boolean accepted) {
        String decision = accepted ? "accepted" : "declined";
        String subject = "Shift Swap " + (accepted ? "Accepted" : "Declined");
        String message = String.format(
            "Dear %s,\n\nYour shift swap request for the shift on %s has been %s.\n\nRegards,\nShift Planner",
            user.getUsername(), shift.getStartTime(), decision
        );
        emailService.sendEmail(user.getEmail(), subject, message);
    }

    /**
     * Notifies a manager (a user with a Manager role) if a shift scheduled in 7 days does not meet the minimum staffing requirements.
     */
    public void notifyManagerForShiftShortage(User user, Shift shift) {
        String subject = "Shift Staffing Alert";
        String message = String.format(
            "Dear %s,\n\nThe shift on %s is scheduled in 7 days and does not meet the minimum staffing requirements.\n\nPlease review the schedule.\n\nRegards,\nShift Planner",
            user.getUsername(), shift.getStartTime()
        );
        emailService.sendEmail(user.getEmail(), subject, message);
    }
}
