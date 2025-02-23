package com.LIT.auth.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.checkerframework.checker.units.qual.m;
import org.springframework.beans.factory.annotation.Autowired;
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
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    private final String logHeader = "[AuthenticationService] - ";

    @Autowired
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
        log.info(logHeader + "initializeDummyUsers: Initializing dummy users. Starting with roles...");
        //Create roles if none exist
        if (roleRepository.count() == 0) {
            roleRepository.saveAll(List.of(
                Role.builder().name("Admin").build(),
                Role.builder().name("ShiftSupervisor").build(),
                Role.builder().name("Technician").build(),
                Role.builder().name("Tester").build(),
                Role.builder().name("Incident-manager").build()
            ));
        }

        log.info(logHeader + "initializeDummyUsers: Roles initialized. Now initializing users...");

        //Create dummy users if none exist
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("Admin")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role shiftSupervisorRole = roleRepository.findByName("ShiftSupervisor")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role technicianRole = roleRepository.findByName("Technician")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role testerRole = roleRepository.findByName("Tester")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role incidentManagerRole = roleRepository.findByName("Incident-manager")
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            User admin = User.builder()
                    .email("admin@example.com")
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(adminRole))
                    .build();

            User shiftSupervisor = User.builder()
                    .email("shiftsupervisor@example.com")
                    .username("shiftSupervisor")
                    .password(passwordEncoder.encode("shiftsuper123"))
                    .roles(Set.of(shiftSupervisorRole))
                    .build();

            User technician = User.builder()
                    .email("technician@example.com")
                    .username("technician")
                    .password(passwordEncoder.encode("technician123"))
                    .roles(Set.of(technicianRole))
                    .build();
            
            User tester = User.builder()
                    .email("tester@example.com")
                    .username("tester")
                    .password(passwordEncoder.encode("tester123"))
                    .roles(Set.of(testerRole))
                    .build();
            
            User incidentManager= User.builder()
                    .email("incidentmanager@example.com")
                    .username("incidentManager")
                    .password(passwordEncoder.encode("incidentmanage123"))
                    .roles(Set.of(incidentManagerRole))
                    .build();

            // Trials for Teacher & End-client
            User trialDavid = User.builder()
                    .email("david@example.com")
                    .username("david")
                    .password(passwordEncoder.encode("david123"))
                    .roles(Set.of(adminRole))
                    .build();

            User trialTorsten = User.builder()
                    .email("torsten@example.com")
                    .username("torsten")
                    .password(passwordEncoder.encode("torsten123"))
                    .roles(Set.of(adminRole))
                    .build();

            log.info(logHeader + "initializeDummyUsers: Users initialized. Saving to DB...");
            userRepository.saveAll(List.of(admin, shiftSupervisor, technician, tester, incidentManager, trialDavid, trialTorsten));
        }
    }

    public Map<String, String> login(LoginRequest loginRequest) {
        log.info(logHeader + "login: Logging in user with email: " + loginRequest.getEmail() + " and password: " + loginRequest.getPassword());

        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if (userOptional.isEmpty() ||
            !passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {

            log.error(logHeader + "login: Invalid credentials");

            if(userOptional.isEmpty()) {
                log.error(logHeader + "login: User not found");
            } else {
                log.error(logHeader + "login: Password does not match. Optional: " + userOptional.get().getPassword() + " Request: " + loginRequest.getPassword());
            }
            throw new InvalidCredentialsException("Invalid credentials");
        }
        User user = userOptional.get();
        //get the first one (this is assuming each user has AT LEAST one)
        String role = user.getRoles().iterator().next().getName();

        log.info(logHeader + "login: User found. Generating token...");

        // Generate token
        String token = "Bearer " + jwtTokenUtil.generateToken(user.getEmail(), role);

         Map<String, String> toReturn = new HashMap<>();
            toReturn.put("token", token);
            toReturn.put("email", user.getEmail());
            toReturn.put("role", role);

        log.info(logHeader + "User " + user.getEmail() + " logged in successfully. Returnig token.");

        return toReturn;
    }

    public void register(RegisterRequest registerRequest) {
        log.info(logHeader + "register: Registering user with email: " + registerRequest.getEmail());

        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            log.error(logHeader + "register: User already exists");
            throw new UserAlreadyExistsException("User already exists!");
        }
        Role employeeRole = roleRepository.findByName("Employee")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        log.info(logHeader + "register: User does not exist. Creating new user...");

        User newUser = User.builder()
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .roles(Set.of(employeeRole))
                .build();

        log.info(logHeader + "register: Saving user to DB...");

        userRepository.save(newUser);
    }
}
