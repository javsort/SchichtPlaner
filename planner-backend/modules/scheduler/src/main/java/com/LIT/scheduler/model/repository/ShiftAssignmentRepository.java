package com.LIT.scheduler.model.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.LIT.scheduler.model.entity.ShiftAssignment;

public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, Long> {

    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.userId = ?1")
    List<ShiftAssignment> findByUserId(Long userId);

    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.shift.id = ?1")
    List<ShiftAssignment> findByShiftId(Long shiftId);
}
