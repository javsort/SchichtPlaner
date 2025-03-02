package com.LIT.auth.model.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.LIT.auth.model.entity.Role;
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    @Query("SELECT r FROM Role r WHERE r.name = ?1")
    Optional<Role> findByName(String name);
}



