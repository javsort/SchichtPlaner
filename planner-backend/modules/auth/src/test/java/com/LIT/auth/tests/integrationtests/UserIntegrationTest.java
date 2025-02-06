package com.LIT.auth.tests.integrationtests;

import com.LIT.auth.model.entity.User;
import com.LIT.auth.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class UserIntegrationTest {

    private UserService userService;
    private User user;

    @BeforeEach
    public void setUp() {
        userService = new UserService(null);
        user = userService.registerUser("test@example.com", "test_user", "password123");
    }

    @Test
    public void testUserRegistration() {
        assertEquals("test@example.com", user.getEmail(), "Email should match");
        assertEquals("test_user", user.getUsername(), "Username should match");
        assertEquals("password123", user.getPassword(), "Password should match");
    }

    @Test
    public void testUserAuthenticationSuccess() {
        boolean isAuthenticated = userService.authenticate(user, "password123");
        assertTrue(isAuthenticated, "Authentication should succeed with the correct password");
    }

    @Test
    public void testUserAuthenticationFailure() {
        boolean isAuthenticated = userService.authenticate(user, "wrongPassword");
        assertFalse(isAuthenticated, "Authentication should fail with the wrong password");
    }
}
