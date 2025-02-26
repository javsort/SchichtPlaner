/*

Will be utilised to get user details from the user service to be shared with other services.

package com.LIT.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.LIT.auth.service.UserService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth")
@Slf4j
public class InnerController {

    private final String logHeader = "[InnerController] - ";

    private final UserService userService;
    
    @Autowired
    public InnerController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getUser/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        log.info(logHeader + "getUser: Getting user with id: " + id);
        return ResponseEntity.ok(userService.getUserById(id));
    }
}
*/