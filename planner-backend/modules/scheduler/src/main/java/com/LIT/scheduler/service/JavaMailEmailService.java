package com.LIT.scheduler.service;

import java.util.Properties;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;


/**
 * Concrete implementation of EmailService using JavaMail.
 */
public class JavaMailEmailService implements EmailService {

    private final String username;
    private final String password;
    private final Properties mailProperties;

    /**
     * Constructs a JavaMailEmailService with SMTP settings.
     *
     * @param host SMTP host (e.g., "smtp.gmail.com")
     * @param port SMTP port (e.g., 587)
     * @param username The email account username.
     * @param password The email account password.
     */
    public JavaMailEmailService(String host, int port, String username, String password) {
        this.username = username;
        this.password = password;
        mailProperties = new Properties();
        mailProperties.put("mail.smtp.auth", "true");
        mailProperties.put("mail.smtp.starttls.enable", "true");
        mailProperties.put("mail.smtp.host", host);
        mailProperties.put("mail.smtp.port", String.valueOf(port));
    }

    @Override
    public void sendEmail(String to, String subject, String messageBody) {
        Session session = Session.getInstance(mailProperties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username)); // Sender's email address
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setText(messageBody);

            Transport.send(message);
            System.out.println("Email sent successfully to " + to);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
