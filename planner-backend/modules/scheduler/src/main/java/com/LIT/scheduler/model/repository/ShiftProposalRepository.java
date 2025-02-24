package com.LIT.scheduler.model.repository;

import com.LIT.scheduler.model.entity.ShiftProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShiftProposalRepository extends JpaRepository<ShiftProposal, Long> {
    List<ShiftProposal> findByEmployeeId(Long employeeId);
}
