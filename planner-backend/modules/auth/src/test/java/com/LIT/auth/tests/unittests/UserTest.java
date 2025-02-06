package com.LIT.auth.tests.unittests;

import com.LIT.auth.model.entity.Role;
import com.LIT.auth.model.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class UserTest {

    private User user;

    @BeforeEach
    public void setUp() {
        user = User.builder()
                .id(1L)
                .email("john.doe@example.com")
                .username("john_doe")
                .password("securePassword123")
                .googleId("google-12345")
                .roles(new HashSet<>())
                .build();
    }

    @Test
    public void testUserCreation() {
        assertNotNull(user, "User object should not be null");
        assertEquals(1L, user.getId(), "User ID should be 1");
        assertEquals("john.doe@example.com", user.getEmail(), "Email should match");
        assertEquals("john_doe", user.getUsername(), "Username should match");
        assertEquals("securePassword123", user.getPassword(), "Password should match");
        assertEquals("google-12345", user.getGoogleId(), "Google ID should match");
        assertNotNull(user.getRoles(), "Roles should not be null");
    }

    @Test
    public void testUserRoleAssignment() {
        Role role = Role.builder()
                .id(1L)
                .name("ROLE_USER")
                .build();

        Set<Role> roles = new HashSet<>(Collections.singletonList(role));
        user.setRoles(roles);

        assertNotNull(user.getRoles(), "Roles should not be null after assignment");
        assertEquals(1, user.getRoles().size(), "User should have 1 role assigned");
        assertEquals("ROLE_USER", user.getRoles().iterator().next().getName(), "Role name should match");
    }
}
