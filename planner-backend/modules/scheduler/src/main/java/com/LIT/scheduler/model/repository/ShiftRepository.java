package com.LIT.scheduler.model.repository;

import com.LIT.scheduler.model.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByTitleContainingIgnoreCase(String title);
}
