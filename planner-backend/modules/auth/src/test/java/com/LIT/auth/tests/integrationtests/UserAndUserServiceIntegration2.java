/*package com.LIT.auth.tests.integrationtests;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.LIT.auth.model.entity.User;
import com.LIT.auth.service.UserService;

public class UserAndUserServiceIntegration2 {

    private UserService userService;
    private User user;

    //Initilizes a new User before each test
    @BeforeEach
    public void setUp() {
        userService = new UserService(userRepository, passwordEncoder);
        user = userService.registerUser("edipeka@hotmail.com", "edipeka", "pass123");
    }

    //Checks if setUsername() works correctly
    @Test
    public void testUpdateUsername() {
        user.setUsername("newedipeka");

        assertEquals("newedipeka", user.getUsername(), "Username should be updated correctly");
    }

    //Checks if setEmail() works correctly
    @Test
    public void testUpdateEmail() {
        user.setEmail("newedipeka@hotmail.com");

        assertEquals("newedipeka@hotmail.com", user.getEmail(), "Email should be updated correctly");
    }
}
*/