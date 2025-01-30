package com.LIT.auth.service;


import com.LIT.auth.model.dto.Req.LoginRequest;
import com.LIT.auth.model.dto.Req.RegisterRequest;
import com.LIT.auth.model.entity.AuthUser;
import com.LIT.auth.model.repository.AuthUserRepository;
import com.LIT.auth.utilities.JwtTokenUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {
    private final AuthUserRepository authUserRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthenticationService(AuthUserRepository authUserRepository, JwtTokenUtil jwtTokenUtil) {
        this.authUserRepository = authUserRepository;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public String login(LoginRequest loginRequest) {
        Optional<AuthUser> userOptional = authUserRepository.findByEmail(loginRequest.getEmail());
        if (userOptional.isEmpty() || !passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return jwtTokenUtil.generateToken(userOptional.get().getEmail());
    }

    public void register(RegisterRequest registerRequest) {
        if (authUserRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists!");
        }

        AuthUser newUser = AuthUser.builder()
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();

        authUserRepository.save(newUser);
    }
}

