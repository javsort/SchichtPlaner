package com.LIT.scheduler.model.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.LIT.scheduler.model.entity.ShiftAssignment;

@Repository
public interface ShiftAssignmentRepository extends JpaRepository<ShiftAssignment, Long> {

    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.userId = ?1")
    List<ShiftAssignment> findByUserId(Long userId);

    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.shift.id = ?1")
    List<ShiftAssignment> findByShiftId(Long shiftId);

    // Conflict detection: find assignments for the same user that overlap with the new shift's time
    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.userId = ?1 AND sa.shift.startTime < ?3 AND sa.shift.endTime > ?2")
    List<ShiftAssignment> findConflictingAssignments(Long userId, LocalDateTime newShiftStart, LocalDateTime newShiftEnd);

    // Find assignment by user id and shift id
    @Query("SELECT sa FROM ShiftAssignment sa WHERE sa.userId = ?1 AND sa.shift.id = ?2")
    Optional<ShiftAssignment> findByUserIdAndShiftId(Long userId, Long shiftId);
}
