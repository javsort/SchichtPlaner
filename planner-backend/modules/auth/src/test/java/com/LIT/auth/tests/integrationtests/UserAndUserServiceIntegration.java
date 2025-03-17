/*package com.LIT.auth.tests.integrationtests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.LIT.auth.model.entity.User;
import com.LIT.auth.service.UserService;

public class UserAndUserServiceIntegration {

    private UserService userService;
    private User user;

    //Initilizes the UserService and registers a user before each tests
    @BeforeEach
    public void setUp() {
        userService = new UserService(null);
        user = userService.registerUser("edipeka@hotmail.com", "edipeka", "pass123");
    }

    //Checks if the object User is registered correctly
    @Test
    public void testUserRegistration() {
        assertEquals("edipeka@hotmail.com", user.getEmail(), "Email should match");
        assertEquals("edipeka", user.getUsername(), "Username should match");
        assertEquals("pass123", user.getPassword(), "Password should match");
    }

    //Checks if authentication works correctly
    @Test
    public void testUserAuthenticationSuccess() {
        boolean isAuthenticated = userService.authenticate(user, "pass123");
        assertTrue(isAuthenticated, "Authentication should succeed with the correct password");
    }

    //Checks if authentication fails if wrong password is provided
    @Test
    public void testUserAuthenticationFailure() {
        boolean isAuthenticated = userService.authenticate(user, "wrongPassword");
        assertFalse(isAuthenticated, "Authentication should fail with the wrong password");
    }
}
*/