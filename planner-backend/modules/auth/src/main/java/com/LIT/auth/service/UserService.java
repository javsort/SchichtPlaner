package com.LIT.auth.service;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LIT.auth.model.entity.User;
import com.LIT.auth.model.entity.Role;
import com.LIT.auth.model.dto.Req.UserDTO;
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


    public List<UserDTO> getAllUsers() {
        log.info(logHeader + "getAllUsers: Getting all users");

        List<User> users = userRepository.findAll();

        log.info(logHeader + "getAlylUsers: Found " + users.size() + " users");

        List<UserDTO> userDTOs = new ArrayList<>();

        for(User user : users){
            UserDTO userDTO = UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .username(user.getUsername())
                    .address(user.getAddress())
                    .phoneNum(user.getPhoneNum())
                    .googleId(user.getGoogleId())
                    .roles(user.getRoles())
                    .build();

            userDTOs.add(userDTO);
        }

        log.info(logHeader + "getAllUsers: Returning " + userDTOs.size() + " users");

        return userDTOs;
    }

    public Optional<User> getUserById(Long id) {
        log.info(logHeader + "getUserById: Getting user by id: " + id);
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        log.info(logHeader + "saveUser: Saving user: " + user);
        return userRepository.save(user);
    }

    public UserDTO updateUser(UserDTO toUpdate){
        log.info(logHeader + "updateUser: Updating user: " + toUpdate);
        User user = userRepository.findById(toUpdate.getId()).orElseThrow(() -> new RuntimeException("User not found"));

        String newEmail = toUpdate.getEmail();
        String newUsername = toUpdate.getUsername();
        String newAddress = toUpdate.getAddress();
        String newPhoneNum = toUpdate.getPhoneNum();
        String newGoogleId = toUpdate.getGoogleId();
        Set<Role> newRoles = toUpdate.getRoles();

        if(newEmail != null){
            user.setEmail(newEmail);
        }

        if(newUsername != null){
            user.setUsername(newUsername);
        }

        if(newAddress != null){
            user.setAddress(newAddress);
        }

        if(newPhoneNum != null){
            user.setPhoneNum(newPhoneNum);
        }

        if(newGoogleId != null){
            user.setGoogleId(newGoogleId);
        }

        if(newRoles != null){
            user.setRoles(newRoles);
        }

        userRepository.save(user);

        log.info(logHeader + "updateUser: User updated: " + user);
        return toUpdate;
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
