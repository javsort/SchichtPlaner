package com.LIT.auth.tests.unittests;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.LIT.auth.model.entity.Role;
import com.LIT.auth.model.repository.RoleRepository;
import com.LIT.auth.service.RoleService;

@ExtendWith(MockitoExtension.class)
public class RoleTest {

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RoleService roleService;

    private Role role;

    @BeforeEach
    void setUp() {
        role = Role.builder().id(1L).name("ADMIN").permissions(Set.of("ROLE_MANAGEMENT", "EMPLOYEE_MANAGEMENT")).build();
    }

    @Test
    void getAllRoles() {
        when(roleRepository.findAll()).thenReturn(List.of(role));

        List<Role> roles = roleService.getAllRoles();

        assertEquals(1, roles.size());
        assertEquals("ADMIN", roles.get(0).getName());
        verify(roleRepository, times(1)).findAll();
    }

    @Test
    void getRoleById() {
        when(roleRepository.findById(1L)).thenReturn(Optional.of(role));

        Optional<Role> retRole = roleService.getRoleById(1L);

        assertTrue(retRole.isPresent());

        assertEquals("ADMIN", role.getName());

        verify(roleRepository, times(1)).findById(1L);
    }

    @Test
    void createRole() {
        when(roleRepository.save(role)).thenReturn(role);

        Role savedRole = roleService.createRole(role);

        assertNotNull(savedRole);
        assertEquals("ADMIN", savedRole.getName());
        verify(roleRepository, times(1)).save(role);
    }

    @Test
    void deleteRole() {
        doNothing().when(roleRepository).deleteById(1L);

        roleService.deleteRole(1L);

        verify(roleRepository, times(1)).deleteById(1L);
    }

    @Test
    void updateRolePermissions() {

        Set<String> newPermissions = Set.of("ROLE_MANAGEMENT", "EMPLOYEE_MANAGEMENT", "SHIFT_MANAGEMENT", "PROPOSAL_APPROVAL");

        when(roleRepository.findById(1L)).thenReturn(Optional.of(role));

        when(roleRepository.save(any(Role.class))).thenReturn(role);

        Optional<Role> updatedRole = roleService.updateRolePermissions(1L, newPermissions);

        assertTrue(updatedRole.isPresent());
        assertEquals(4, updatedRole.get().getPermissions().size());

        assertTrue(updatedRole.get().getPermissions().contains("SHIFT_MANAGEMENT"));
        assertTrue(updatedRole.get().getPermissions().contains("PROPOSAL_APPROVAL"));
        assertTrue(updatedRole.get().getPermissions().contains("ROLE_MANAGEMENT"));
        assertTrue(updatedRole.get().getPermissions().contains("EMPLOYEE_MANAGEMENT"));

        verify(roleRepository, times(1)).findById(1L);
        verify(roleRepository, times(1)).save(role);
    }

    @Test
    void getAllPermissions() {
        Set<String> permissions = roleService.getAllPermissions();

        assertEquals(9, permissions.size());
        assertTrue(permissions.contains("ROLE_MANAGEMENT"));
        assertTrue(permissions.contains("CALENDAR_VIEW"));
    }

}
