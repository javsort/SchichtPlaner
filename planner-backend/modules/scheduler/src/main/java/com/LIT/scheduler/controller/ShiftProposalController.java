package com.LIT.scheduler.controller;

import com.LIT.scheduler.model.entity.ShiftProposal;
import com.LIT.scheduler.service.ShiftProposalService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/scheduler/shift-proposals")
public class ShiftProposalController {

    private final ShiftProposalService proposalService;
    private final static String logHeader = "[ShiftProposalController] - ";

    @Autowired
    public ShiftProposalController(ShiftProposalService proposalService) {
        this.proposalService = proposalService;
    }

    // Employee submits new shift change request, must include currentShiftId
    @PostMapping("/request-change")
    public ResponseEntity<ShiftProposal> requestShiftChange(@RequestBody ShiftProposal proposal) {
        log.info(logHeader + "requestShiftChange: Received shift change request from employee " + proposal.getEmployeeId());
        ShiftProposal savedProposal = proposalService.createProposal(proposal);
        return ResponseEntity.ok(savedProposal);
    }

    // Manager accepts shift change request and specifies the swap employee id as a request parameter
    @PutMapping("/{proposalId}/accept-change")
    public ResponseEntity<ShiftProposal> acceptShiftChange(@PathVariable Long proposalId, @RequestParam Long swapEmployeeId) {
        log.info(logHeader + "acceptShiftChange: Manager accepting shift change for proposal " + proposalId + " with swap employee " + swapEmployeeId);
        ShiftProposal updatedProposal = proposalService.acceptShiftChange(proposalId, swapEmployeeId);
        return ResponseEntity.ok(updatedProposal);
    }

    // Manager declines shift change request
    @PutMapping("/{proposalId}/decline-change")
    public ResponseEntity<ShiftProposal> declineShiftChange(@PathVariable Long proposalId, @RequestBody(required = false) String managerComment) {
        log.info(logHeader + "declineShiftChange: Manager declining shift change for proposal " + proposalId);
        ShiftProposal updatedProposal = proposalService.declineShiftChange(proposalId, managerComment);
        return ResponseEntity.ok(updatedProposal);
    }

    // Employee retrieves their proposals
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ShiftProposal>> getProposalsByEmployee(@PathVariable Long employeeId) {
        log.info(logHeader + "getProposalsByEmployee: Getting proposals for employee with id: " + employeeId);
        List<ShiftProposal> proposals = proposalService.getProposalsByEmployee(employeeId);
        return ResponseEntity.ok(proposals);
    }

    // Manager retrieves all proposals
    @GetMapping
    public ResponseEntity<List<ShiftProposal>> getAllProposals() {
        log.info(logHeader + "getAllProposals: Getting all proposals");
        List<ShiftProposal> proposals = proposalService.getAllProposals();
        return ResponseEntity.ok(proposals);
    }
}
