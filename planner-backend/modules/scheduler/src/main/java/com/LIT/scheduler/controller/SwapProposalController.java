package com.LIT.scheduler.controller;

import com.LIT.scheduler.model.entity.SwapProposal;
import com.LIT.scheduler.service.ShiftProposalService;
import com.LIT.scheduler.service.SwapProposalService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/scheduler/swap-proposals")
public class SwapProposalController {

    private final SwapProposalService proposalService;
    private final static String logHeader = "[SwapProposalController] - ";

    @Autowired
    public SwapProposalController(SwapProposalService proposalService) {
        this.proposalService = proposalService;
    }

    // Employee submits new swap change request, must include currentShiftId
    @PostMapping("/request-change")
    public ResponseEntity<SwapProposal> requestShiftChange(@RequestBody SwapProposal proposal) {
        log.info(logHeader + "requestShiftChange: Received swap change request from employee " + proposal.getEmployeeId());
        SwapProposal savedProposal = proposalService.createProposal(proposal);
        return ResponseEntity.ok(savedProposal);
    }

    // Manager accepts swap change request and specifies the swap employee id as a request parameter
    @PutMapping("/{proposalId}/accept-change")
    public ResponseEntity<SwapProposal> acceptShiftChange(@PathVariable Long proposalId, @RequestParam Long swapEmployeeId) {
        log.info(logHeader + "acceptShiftChange: Manager accepting swap change for proposal " + proposalId + " with swap employee " + swapEmployeeId);
        SwapProposal updatedProposal = proposalService.acceptShiftChange(proposalId, swapEmployeeId);
        return ResponseEntity.ok(updatedProposal);
    }

    // Manager declines swap change request
    @PutMapping("/{proposalId}/decline-change")
    public ResponseEntity<SwapProposal> declineShiftChange(@PathVariable Long proposalId, @RequestBody(required = false) String managerComment) {
        log.info(logHeader + "declineShiftChange: Manager declining swap change for proposal " + proposalId);
        SwapProposal updatedProposal = proposalService.declineShiftChange(proposalId, managerComment);
        return ResponseEntity.ok(updatedProposal);
    }

    // Employee retrieves their proposals
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<SwapProposal>> getProposalsByEmployee(@PathVariable Long employeeId) {
        log.info(logHeader + "getProposalsByEmployee: Getting proposals for employee with id: " + employeeId);
        List<SwapProposal> proposals = proposalService.getProposalsByEmployee(employeeId);
        return ResponseEntity.ok(proposals);
    }

    // Manager retrieves all proposals
    @GetMapping
    public ResponseEntity<List<SwapProposal>> getAllProposals() {
        log.info(logHeader + "getAllProposals: Getting all proposals");
        List<SwapProposal> proposals = proposalService.getAllProposals();
        return ResponseEntity.ok(proposals);
    }
}
