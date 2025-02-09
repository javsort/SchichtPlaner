package com.LIT.scheduler.model.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.LIT.scheduler.model.entity.ShiftAssignment;

public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, Long> {

    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.userId = ?1")
    List<ShiftAssignment> findByUserId(Long userId);

    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.shift.id = ?1")
    List<ShiftAssignment> findByShiftId(Long shiftId);

    //Conflict detection. Checks for assignment for the same user whose shift time overlaps with the new shift.
    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.userId = ?1 AND sa.shift.startTime < ?3 AND sa.shift.endTime > ?2")
    List<ShiftAssignment> findConflictingAssignments(Long userId, LocalDateTime newShiftStart, LocalDateTime newShiftEnd);
}

