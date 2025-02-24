package com.LIT.auth.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LIT.auth.model.entity.User;
import com.LIT.auth.model.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    private final String logHeader = "[UserService] - ";

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public List<User> getAllUsers() {
        log.info(logHeader + "getAllUsers: Getting all users");
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        log.info(logHeader + "getUserById: Getting user by id: " + id);
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        log.info(logHeader + "saveUser: Saving user: " + user);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        log.info(logHeader + "deleteUser: Deleting user by id: " + id);
        userRepository.deleteById(id);
    }

    public User registerUser(String email, String username, String password) {
        log.info(logHeader + "registerUser: Registering user with email: '" + email + "', username: '" + username + "'");
        User user = User.builder()
                .email(email)
                .username(username)
                .password(password)
                .build();

        if (userRepository != null) {
            log.info(logHeader + "registerUser: Saving user: " + user);
            return userRepository.save(user);
        }

        log.error(logHeader + "registerUser: User repository is null");
        return user;
    }

    public boolean authenticate(User user, String password) {
        log.info(logHeader + "authenticate: Authenticating user: " + user);
        return user.getPassword().equals(password);
    }
}
