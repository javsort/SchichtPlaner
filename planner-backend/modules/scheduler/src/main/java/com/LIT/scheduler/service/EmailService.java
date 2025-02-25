package com.LIT.scheduler.service;

/**
 * An interface to abstract the email sending mechanism.
 */
public interface EmailService {
    /**
     * Sends an email.
     * @param to Recipient email address.
     * @param subject Subject line of the email.
     * @param message Email body content.
     */
    void sendEmail(String to, String subject, String message);
}
