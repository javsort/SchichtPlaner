package com.LIT.scheduler.model.repository;

import java.sql.Timestamp;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.LIT.scheduler.model.entity.ShiftAssignment;

public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, Long> {

    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.userId = ?1")
    List<ShiftAssignment> findByUserId(Long userId);

    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.shift.id = ?1")
    List<ShiftAssignment> findByShiftId(Long shiftId);

    // Conflict detection: find assignments for the same user that overlap with the new shift's time
    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.userId = ?1 AND sa.shift.startTime < ?3 AND sa.shift.endTime > ?2")
    List<ShiftAssignment> findConflictingAssignments(Long userId, Timestamp newShiftStart, Timestamp newShiftEnd);
}
