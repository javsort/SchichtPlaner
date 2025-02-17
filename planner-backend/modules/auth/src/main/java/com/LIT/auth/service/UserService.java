package com.LIT.auth.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.LIT.auth.model.entity.User;
import com.LIT.auth.model.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User registerUser(String email, String username, String password) {
        User user = User.builder()
                .email(email)
                .username(username)
                .password(password)
                .build();
        if (userRepository != null) {
            return userRepository.save(user);
        }
        return user;
    }

    public boolean authenticate(User user, String password) {
        return user.getPassword().equals(password);
    }
}
