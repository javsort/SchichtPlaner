package com.LIT.scheduler.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.LIT.scheduler.model.entity.SwapProposal;

@Repository
public interface SwapProposalRepository extends JpaRepository<SwapProposal, Long> {

    @Query("SELECT sp FROM SwapProposal sp WHERE sp.employeeId = ?1")
    List<SwapProposal> findByEmployeeId(Long employeeId);
}
