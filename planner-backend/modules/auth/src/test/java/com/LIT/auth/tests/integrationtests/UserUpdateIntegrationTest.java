package com.LIT.auth.tests.integrationtests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.LIT.auth.model.entity.User;
import com.LIT.auth.service.UserService;

public class UserUpdateIntegrationTest {

    private UserService userService;
    private User user;

    @BeforeEach
    public void setUp() {
        userService = new UserService(null);
        user = userService.registerUser("update@example.com", "update_user", "initialPassword");
    }

    @Test
    public void testUpdateUsername() {
        user.setUsername("updated_user");

        assertEquals("updated_user", user.getUsername(), "Username should be updated correctly");
    }

    @Test
    public void testUpdateEmail() {
        user.setEmail("new_email@example.com");

        assertEquals("new_email@example.com", user.getEmail(), "Email should be updated correctly");
    }
}
