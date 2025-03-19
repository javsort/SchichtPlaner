package com.LIT.scheduler.model.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.LIT.scheduler.model.entity.Shift;

public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT s FROM Shift s WHERE s.shiftOwnerId = ?1 AND " +
           "((s.startTime BETWEEN ?2 AND ?3) OR " +
           "(s.endTime BETWEEN ?2 AND ?3) OR " +
           "(?2 BETWEEN s.startTime AND s.endTime))")
    List<Shift> findConflictingShifts(Long shiftOwnerId, LocalDateTime start, LocalDateTime end);

    List<Shift> findByShiftOwnerId(Long shiftOwnerId);
}
