package com.LIT.scheduler.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.LIT.scheduler.model.entity.Shift;

public interface ShiftRepository extends JpaRepository<Shift, Long> {

    
    //List<Shift> findByTitleContainingIgnoreCase(String title);
}
