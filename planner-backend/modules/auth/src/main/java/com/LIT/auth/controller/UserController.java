package com.LIT.auth.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.LIT.auth.model.dto.Req.UserDTO;
import com.LIT.auth.model.entity.User;
import com.LIT.auth.service.UserService;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/api/auth/users")
public class UserController {
    private final UserService userService;

    private final String logHeader = "[UserController] - ";

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        log.info(logHeader + "getAllUsers: Getting all users");

        return userService.getAllUsers();
    }

    private Set<String> getPermissions(String permissions) {
        return Arrays.stream(permissions.split(","))
                    .map(String::trim)
                    .collect(Collectors.toSet());
    }

    @GetMapping("/{id}")    
    public ResponseEntity<User> getUserById(@PathVariable Long id, @RequestHeader("X-User-Permissions") String permissions) {
        log.info(logHeader + "getUserById: User with permissions: '" + permissions + "' wants to retrieve user info with the id: " + id);

        if(permissions == null || permissions.isEmpty()) {
            log.error(logHeader + "getUserById: ERROR! User permissions is not provided in the header");

            return ResponseEntity.badRequest().build();
        }

        Set<String> userPermissions = getPermissions(permissions);

        if(!userPermissions.contains("EMPLOYEE_MANAGEMENT")) {
            log.error(logHeader + "getUserById: ERROR! User does not have permission to get user by id. The user permissions is: " + permissions);
            log.info(logHeader + "The needed permission is: 'EMPLOYEE_MANAGEMENT'");

            return ResponseEntity.status(403).build();
        }

        log.info(logHeader + "getUserById: permissions are valid. Getting user by id: " + id);

        Optional<User> user = userService.getUserById(id);

        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping    
    public User createUser(@RequestBody User user) {
        log.info(logHeader + "createUser: Creating user: " + user);
        
        return userService.saveUser(user);
    }

    @PostMapping("/update")
    public UserDTO updateUser(@RequestBody UserDTO user) {
        log.info(logHeader + "updateUser: Updating user: " + user);

        return userService.updateUser(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, @RequestHeader("X-User-Permissions") String permissions) {
        log.info(logHeader + "deleteUser: Deleting user by id: " + id + " with permissions: " + permissions);

        if(permissions == null || permissions.isEmpty()) {
            log.error(logHeader + "getUserById: ERROR! User permissions are not provided in the header");

            return ResponseEntity.badRequest().build();
        }

        Set<String> userPermissions = getPermissions(permissions);

        if(!userPermissions.contains("EMPLOYEE_DELETE")) {
            log.error(logHeader + "getUserById: ERROR! User does not have permission to get user by id. The user permissions is: " + permissions);
            log.info(logHeader + "The needed permission is: 'EMPLOYEE_DELETE'");

            return ResponseEntity.status(403).build();
        }

        log.info(logHeader + "deleteUser: permissions is valid. Deleting user by id: " + id);

        userService.deleteUser(id);
        
        return ResponseEntity.noContent().build();
    }
}