package com.LIT.auth.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LIT.auth.model.entity.Role;
import com.LIT.auth.model.repository.RoleRepository;

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
}

