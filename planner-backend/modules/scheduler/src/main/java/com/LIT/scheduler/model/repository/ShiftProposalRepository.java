package com.LIT.scheduler.model.repository;

import com.LIT.scheduler.model.entity.ShiftProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftProposalRepository extends JpaRepository<ShiftProposal, Long> {

    @Query("SELECT sp FROM ShiftProposal sp WHERE sp.employeeId = ?1")
    List<ShiftProposal> findByEmployeeId(Long employeeId);
}
