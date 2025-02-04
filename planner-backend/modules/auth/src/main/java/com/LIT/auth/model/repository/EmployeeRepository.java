package com.LIT.auth.model.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.LIT.auth.model.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByGoogleId(String googleId);
}
