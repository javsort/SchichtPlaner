package com.LIT.scheduler.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.LIT.scheduler.model.entity.Shift;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    //basic CRUD
}
