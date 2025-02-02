package com.LIT.auth.service;

import com.LIT.auth.exception.InvalidCredentialsException;
import com.LIT.auth.exception.UserAlreadyExistsException;
import com.LIT.auth.model.dto.Req.LoginRequest;
import com.LIT.auth.model.dto.Req.RegisterRequest;
import com.LIT.auth.model.entity.AuthUser;
import com.LIT.auth.model.entity.Role;
import com.LIT.auth.model.repository.AuthUserRepository;
import com.LIT.auth.model.repository.RoleRepository;
import com.LIT.auth.utilities.JwtTokenUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthenticationService {
    private final AuthUserRepository authUserRepository;
    private final RoleRepository roleRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(AuthUserRepository authUserRepository,
                                 RoleRepository roleRepository,
                                 JwtTokenUtil jwtTokenUtil,
                                 PasswordEncoder passwordEncoder) {
        this.authUserRepository = authUserRepository;
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
        if (authUserRepository.count() == 0) {
            Role adminRole = roleRepository.findByName("Admin")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role managerRole = roleRepository.findByName("Manager")
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            Role employeeRole = roleRepository.findByName("Employee")
                    .orElseThrow(() -> new RuntimeException("Role not found"));

            AuthUser admin = AuthUser.builder()
                    .email("admin@example.com")
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(Set.of(adminRole))
                    .build();

            AuthUser manager = AuthUser.builder()
                    .email("manager@example.com")
                    .username("manager")
                    .password(passwordEncoder.encode("manager123"))
                    .roles(Set.of(managerRole))
                    .build();

            AuthUser employee = AuthUser.builder()
                    .email("employee@example.com")
                    .username("employee")
                    .password(passwordEncoder.encode("employee123"))
                    .roles(Set.of(employeeRole))
                    .build();

            authUserRepository.saveAll(List.of(admin, manager, employee));
        }
    }

    public String login(LoginRequest loginRequest) {
        Optional<AuthUser> userOptional = authUserRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty() ||
            !passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }
        AuthUser user = userOptional.get();
        //get the first one (this is assuming each user has AT LEAST one)
        String role = user.getRoles().iterator().next().getName();
        return jwtTokenUtil.generateToken(user.getEmail(), role);
    }

    public void register(RegisterRequest registerRequest) {
        if (authUserRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User already exists!");
        }
        Role employeeRole = roleRepository.findByName("Employee")
                .orElseThrow(() -> new RuntimeException("Default role not found"));

        AuthUser newUser = AuthUser.builder()
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .roles(Set.of(employeeRole))
                .build();

        authUserRepository.save(newUser);
    }
}
