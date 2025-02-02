package com.LIT.auth.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.LIT.auth.exception.InvalidCredentialsException;
import com.LIT.auth.exception.UserAlreadyExistsException;
import com.LIT.auth.model.dto.Req.LoginRequest;
import com.LIT.auth.model.dto.Req.RegisterRequest;
import com.LIT.auth.model.entity.Role;
import com.LIT.auth.model.entity.User;
import com.LIT.auth.model.repository.RoleRepository;
import com.LIT.auth.model.repository.UserRepository;
import com.LIT.auth.utilities.JwtTokenUtil;

import jakarta.annotation.PostConstruct;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserRepository userRepository,
                                 RoleRepository roleRepository,
                                 JwtTokenUtil jwtTokenUtil,
                                 PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
    }

    //Inserts dummy roles and users (only if DB is empty)
    @PostConstruct
    public void initializeDummyUsers() {
        //Create roles if none exist
        if (roleRepository.count() == 0) {
            roleRepository.saveAll(List.of(
                new Role(null, "Admin"),
                new Role(null, "Manager"),
                new Role(null, "Employee")
            ));
        }
        //Create dummy users if none exist
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("Admin")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role managerRole = roleRepository.findByName("Manager")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role employeeRole = roleRepository.findByName("Employee")
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            User admin = User.builder()
                    .email("admin@example.com")
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(adminRole))
                    .build();

            User manager = User.builder()
                    .email("manager@example.com")
                    .username("manager")
                    .password(passwordEncoder.encode("manager123"))
                    .roles(Set.of(managerRole))
                    .build();

            User employee = User.builder()
                    .email("employee@example.com")
                    .username("employee")
                    .password(passwordEncoder.encode("employee123"))
                    .roles(Set.of(employeeRole))
                    .build();

            userRepository.saveAll(List.of(admin, manager, employee));
        }
    }

    public String login(LoginRequest loginRequest) {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty() ||
            !passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }
        User user = userOptional.get();
        //get the first one (this is assuming each user has AT LEAST one)
        String role = user.getRoles().iterator().next().getName();
        return jwtTokenUtil.generateToken(user.getEmail(), role);
    }

    public void register(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User already exists!");
        }
        Role employeeRole = roleRepository.findByName("Employee")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        User newUser = User.builder()
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .roles(Set.of(employeeRole))
                .build();

        userRepository.save(newUser);
    }
}
