package com.LIT.auth.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LIT.auth.model.entity.Role;
import com.LIT.auth.model.repository.RoleRepository;
import com.LIT.auth.model.entity.permissions.RolePermissions;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RoleService {
    private final RoleRepository roleRepository;

    private final String logHeader = "[RoleService] - ";

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> getAllRoles() {
        log.info(logHeader + "getAllRoles: Getting all roles");
        return roleRepository.findAll();
    }

    public Optional<Role> getRoleById(Long id) {
        log.info(logHeader + "getRoleById: Getting role by id: " + id);
        return roleRepository.findById(id);
    }

    public Role createRole(Role role) {
        log.info(logHeader + "createRole: Creating role: " + role);
        return roleRepository.save(role);
    }

    public void deleteRole(Long id) {
        log.info(logHeader + "deleteRole: Deleting role by id: " + id);
        roleRepository.deleteById(id);
    }

    public Optional<Role> updateRolePermissions(Long id, Set<String> permissions) {
        log.info(logHeader + "updateRolePermissions: Updating role permissions by id: " + id);

        Optional<Role> role = roleRepository.findById(id);
        role.ifPresent(r -> {
            r.setPermissions(permissions);
            roleRepository.save(r);
        });

        return role;
    }

    public Set<String> getAllPermissions() {
        log.info(logHeader + "getAllPermissions: Getting all permissions");
        return Arrays.stream(RolePermissions.values())
                     .map(Enum::name)
                     .collect(Collectors.toSet());
    }
}

