package com.LIT.scheduler;

import java.util.Properties;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import com.LIT.scheduler.service.NotificationService;

@SpringBootTest(
    classes = { NotificationService.class },
    webEnvironment = SpringBootTest.WebEnvironment.NONE,
    properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb", 
        "spring.datasource.driverClassName=org.h2.Driver",
        "spring.datasource.username=shiftplanner51@gmail.com", 
        "spring.datasource.password=qpkj khka xotv xihe",
        "spring.jpa.hibernate.ddl-auto=none"
    }
)
@Import(NotificationServiceIntegrationTest.MailTestConfiguration.class)
public class NotificationServiceIntegrationTest {

    @Autowired
    private NotificationService notificationService;

    @Test
    public void testSendEmail() {
        // This test will send a real email (if your mail credentials are valid).
        notificationService.sendEmail("pekaric.edi1@gmail.com", "Integration Test Email", "tu smo");
    }

    @TestConfiguration
    static class MailTestConfiguration {

        @Bean
        public JavaMailSender javaMailSender() {
            JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
            // Configure your mail server settings here (using Gmail as an example)
            mailSender.setHost("smtp.gmail.com");
            mailSender.setPort(587);
            mailSender.setUsername("shiftplanner51@gmail.com");
            mailSender.setPassword("qpkj khka xotv xihe"); // Use your actual password or use environment variables

            Properties props = mailSender.getJavaMailProperties();
            props.put("mail.transport.protocol", "smtp");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.debug", "true");
            return mailSender;
        }
    }
}
