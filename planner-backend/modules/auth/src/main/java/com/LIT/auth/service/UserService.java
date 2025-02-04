package com.LIT.auth.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.LIT.auth.model.entity.User;
import com.LIT.auth.model.repository.EmployeeRepository;

@Service
public class UserService {
    private final EmployeeRepository userRepository;

    public UserService(EmployeeRepository userRepository) {
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
}
