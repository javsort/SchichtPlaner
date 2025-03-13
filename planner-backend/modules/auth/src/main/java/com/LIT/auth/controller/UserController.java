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

import com.LIT.auth.model.entity.User;
import com.LIT.auth.model.dto.Req.UserDTO;
import com.LIT.auth.service.UserService;

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

    @GetMapping("/{id}")    
    public ResponseEntity<User> getUserById(@PathVariable Long id, @RequestHeader("X-User-Role") String role) {
        log.info(logHeader + "getUserById: User with role: '" + role + "' wants to retrieve user info with the id: " + id);

        if(role == null) {
            log.error(logHeader + "getUserById: ERROR! User role is not provided in the header");

            return ResponseEntity.badRequest().build();
        }

        if(!role.equals("ROLE_Admin") && !role.equals("ROLE_Shift-Supervisor")) {
            log.error(logHeader + "getUserById: ERROR! User does not have the clearance to get a user by id. The user role is: " + role);

            return ResponseEntity.badRequest().build();
        }

        log.info(logHeader + "getUserById: Role is valid. Getting user by id: " + id);

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
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, @RequestHeader("X-User-Role") String role) {
        log.info(logHeader + "deleteUser: Deleting user by id: " + id + " with role: " + role);

        if(role == null) {
            log.error(logHeader + "getUserById: ERROR! User role is not provided in the header");

            return ResponseEntity.badRequest().build();
        }

        if(!role.equals("ROLE_Admin")) {
            log.error(logHeader + "deleteUser: ERROR! User does not have permission to delete user. The user role is: " + role);

            return ResponseEntity.badRequest().build();
        }

        log.info(logHeader + "deleteUser: Role is valid. Deleting user by id: " + id);

        userService.deleteUser(id);
        
        return ResponseEntity.noContent().build();
    }
}