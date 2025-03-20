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
    private final UserService userService;

    private final String logHeader = "[AuthenticationService] - ";

    @Autowired
    public AuthenticationService(UserRepository userRepository,
                                 RoleRepository roleRepository,
                                 JwtTokenUtil jwtTokenUtil,
                                 PasswordEncoder passwordEncoder,
                                 UserService userService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    //Inserts dummy roles and users (only if DB is empty)
    @PostConstruct
    public void initializeDummyUsers() {
        log.info(logHeader + "initializeDummyUsers: Initializing dummy users. Starting with roles...");
        //Create roles if none exist
        if (roleRepository.count() == 0) {
            roleRepository.saveAll(List.of(
                Role.builder().name("Admin").permissions(Set.of("CALENDAR_VIEW", "SHIFT_PROPOSAL", "SWAP_PROPOSAL", "ROLE_MANAGEMENT", "EMPLOYEE_MANAGEMENT", "EMPLOYEE_DELETE", "SHIFT_MANAGEMENT", "PROPOSAL_APPROVAL", "SWAP_APPROVAL", "EMPLOYEE_REPORT")).build(),
                Role.builder().name("Shift-Supervisor").permissions(Set.of("CALENDAR_VIEW", "SHIFT_PROPOSAL", "SWAP_PROPOSAL", "EMPLOYEE_MANAGEMENT", "SHIFT_MANAGEMENT", "PROPOSAL_APPROVAL", "SWAP_APPROVAL", "EMPLOYEE_REPORT")).build(),
                Role.builder().name("Technician").permissions(Set.of("CALENDAR_VIEW", "SHIFT_PROPOSAL", "SWAP_PROPOSAL", "EMPLOYEE_REPORT")).build(),
                Role.builder().name("Tester").permissions(Set.of("CALENDAR_VIEW", "SHIFT_PROPOSAL", "SWAP_PROPOSAL")).build(),
                Role.builder().name("Incident-Manager").permissions(Set.of("CALENDAR_VIEW", "SHIFT_PROPOSAL", "SWAP_PROPOSAL")).build()
            ));
        }

        log.info(logHeader + "initializeDummyUsers: Roles initialized. Now initializing users...");

        //Create dummy users if none exist
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("Admin")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role shiftSupervisorRole = roleRepository.findByName("Shift-Supervisor")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role technicianRole = roleRepository.findByName("Technician")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role testerRole = roleRepository.findByName("Tester")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role incidentManagerRole = roleRepository.findByName("Incident-Manager")
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            User admin = User.builder()
                    .email("admin@example.com")
                    .username("Admin Adminson")
                    .password(passwordEncoder.encode("admin123"))
                    .address("1234 Admin St")
                    .phoneNum("123-456-7890")
                    .roles(Set.of(adminRole))
                    .build();

            User shiftSupervisor = User.builder()
                    .email("shiftsupervisor@example.com")
                    .username("Shift Supervisor Smith")
                    .password(passwordEncoder.encode("shiftsuper123"))
                    .address("1234 Shift Supervisor St")
                    .phoneNum("123-456-7890")
                    .roles(Set.of(shiftSupervisorRole))
                    .build();

            User technician = User.builder()
                    .email("technician@example.com")
                    .username("Technician Mike")
                    .password(passwordEncoder.encode("technician123"))
                    .address("1234 Technician St")
                    .phoneNum("123-456-7890")
                    .roles(Set.of(technicianRole))
                    .build();
            
            User tester = User.builder()
                    .email("tester@example.com")
                    .username("Tester Testerson")
                    .password(passwordEncoder.encode("tester123"))
                    .roles(Set.of(testerRole))
                    .address("1234 Tester St")
                    .phoneNum("123-456-7890")
                    .build();
            
            User incidentManager= User.builder()
                    .email("incidentmanager@example.com")
                    .username("Incident Manager Luis")
                    .password(passwordEncoder.encode("incidentmanage123"))
                    .roles(Set.of(incidentManagerRole))
                    .address("1234 Incident Manager St")
                    .phoneNum("123-456-7890")
                    .build();

            // Trials for Teacher & End-client
            User trialDavid = User.builder()
                    .email("david@example.com")
                    .username("David Reichelt")
                    .password(passwordEncoder.encode("david123"))
                    .roles(Set.of(adminRole))
                    .address("1234 David St")
                    .phoneNum("123-456-7890")
                    .build();

            User trialTorsten = User.builder()
                    .email("torsten@example.com")
                    .username("Torsten Frost")
                    .password(passwordEncoder.encode("torsten123"))
                    .roles(Set.of(adminRole))
                    .address("1234 Torsten St")
                    .phoneNum("123-456-7890")
                    .build();

            List<User> generatedUsers = List.of(admin, shiftSupervisor, technician, tester, incidentManager, trialDavid, trialTorsten);

            log.info(logHeader + "initializeDummyUsers: Users initialized. Saving to DB...");
            userRepository.saveAll(generatedUsers);
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
        String permissions = String.join(",", user.getRoles().iterator().next().getPermissions());
        String username = user.getUsername();

        log.info(logHeader + "login: User found. Generating token...");

        // Generate token
        String token = "Bearer " + jwtTokenUtil.generateToken(user.getEmail(), role, user.getId(), user.getUsername());

        Map<String, String> toReturn = new HashMap<>();
        toReturn.put("token", token);
        toReturn.put("email", user.getEmail());
        toReturn.put("role", role);
        toReturn.put("userId", user.getId().toString());
        toReturn.put("username", username);
        toReturn.put("permissions", permissions);

        log.info(logHeader + "User " + user.getEmail() + " logged in successfully. Returnig token.");

        return toReturn;
    }

    public Map<String, String> getForNewCommer(LoginRequest loginRequest) {
        log.info(logHeader + "getForNewCommer: New user first login detected. Need to finalize registration.");

        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        if(userOptional.isEmpty()) {
                log.error(logHeader + "login: User not found");
        }

        User user = userOptional.get();

        Map<String, String> toReturn = new HashMap<>();

        toReturn.put("userId", user.getId().toString());
        toReturn.put("email", user.getEmail());
        toReturn.put("username", user.getUsername());
        toReturn.put("role", user.getRoles().iterator().next().getName());

        return toReturn;
    }

    // Fulfill registration
    public Map<String, String> register(RegisterRequest registerRequest) {
        log.info(logHeader + "register: Fulfilling registration  user with email: " + registerRequest.getEmail());

        Optional<User> userOptional = userRepository.findByEmail(registerRequest.getEmail());

        if(userOptional.isEmpty()) {
                log.error(logHeader + "login: User not found");
                throw new InvalidCredentialsException("Invalid credentials");
        }
        
        // Update with new password
        User newUser = userOptional.get();
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        log.info(logHeader + "register: Saving user to DB with updated password...");

        userRepository.save(newUser);

        // Build metadata to finish the login
        String role = newUser.getRoles().iterator().next().getName();
        String permissions = String.join(",", newUser.getRoles().iterator().next().getPermissions());
        String username = newUser.getUsername();

        log.info(logHeader + "login: newUser found. Generating token...");

        // Generate token
        String token = "Bearer " + jwtTokenUtil.generateToken(newUser.getEmail(), role, newUser.getId(), newUser.getUsername());

        Map<String, String> toReturn = new HashMap<>();
        toReturn.put("token", token);
        toReturn.put("email", newUser.getEmail());
        toReturn.put("role", role);
        toReturn.put("userId", newUser.getId().toString());
        toReturn.put("username", username);
        toReturn.put("permissions", permissions);

        log.info(logHeader + "newUser " + newUser.getEmail() + " logged in successfully. Returnig token.");

        return toReturn;
}
}
