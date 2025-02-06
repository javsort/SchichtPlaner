package com.LIT.auth.tests.unittests;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.LIT.auth.model.entity.Role;
import com.LIT.auth.model.entity.User;

public class UserTest {

    private User user;

    //Initilizes an object User before each test
    @BeforeEach
    public void setUp() {
        user = User.builder()
                .id(1L)
                .email("edipeka@hotmail.com")
                .username("edipeka")
                .password("pass123")
                .googleId("goog123")
                .roles(new HashSet<>())
                .build();
    }

    //Checks if the object User is created and initilized correctly
    @Test
    public void testUserCreation() {
        assertNotNull(user, "User object should not be null");
        assertEquals(1L, user.getId(), "User ID should be 1");
        assertEquals("edipeka@hotmail.com", user.getEmail(), "Email should match");
        assertEquals("edipeka", user.getUsername(), "Username should match");
        assertEquals("pass123", user.getPassword(), "Password should match");
        assertEquals("goog123", user.getGoogleId(), "Google ID should match");
        assertNotNull(user.getRoles(), "Roles should not be null");
    }

    //Checks if a role can be assigned to object User
    @Test
    public void testUserRoleAssignment() {
        Role role = Role.builder()
                .id(1L)
                .name("ADMIN")
                .build();

        Set<Role> roles = new HashSet<>(Collections.singletonList(role));
        user.setRoles(roles);

        assertNotNull(user.getRoles(), "Roles should not be null after assignment");
        assertEquals(1, user.getRoles().size(), "User should have 1 role assigned");
        assertEquals("ADMIN", user.getRoles().iterator().next().getName(), "Role name should match");
    }
}
