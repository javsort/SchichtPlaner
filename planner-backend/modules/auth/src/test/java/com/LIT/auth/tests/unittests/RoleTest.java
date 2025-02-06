package com.LIT.auth.tests.unittests;

import static org.junit.jupiter.api.Assertions.assertEquals; // Correct static import for assertions
import org.junit.jupiter.api.Test; // Import for the @Test annotation

import com.LIT.auth.model.entity.Role;

public class RoleTest {

    //Verifies that object Role is definied
    @Test
    void testRoleCreation() {
        Role role = new Role(1L, "ADMIN");
        assertEquals(1L, role.getId());  // Direct comparison with primitive long
        assertEquals("ADMIN", role.getName());
    }

    //Checks if setName works correctly
    @Test
    void testRoleModification() {
        Role role = new Role(2L, "USER");
        role.setName("MODERATOR");
        assertEquals("MODERATOR", role.getName());
    }
}
