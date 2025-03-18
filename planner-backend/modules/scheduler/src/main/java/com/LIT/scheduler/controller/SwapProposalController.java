package com.LIT.scheduler.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.LIT.scheduler.model.entity.SwapProposal;
import com.LIT.scheduler.service.SwapProposalService;

import lombok.extern.slf4j.Slf4j;

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

    @PutMapping("/test")
    public ResponseEntity<String> testPut() {
        log.info("DEBUG: Test PUT endpoint called");
        return ResponseEntity.ok("Test PUT successful");
    }

    @PutMapping("/test-path-var/{id}")
    public ResponseEntity<String> testPathVar(@PathVariable Long id) {
        log.info("DEBUG: Test path variable endpoint called with id: " + id);
        return ResponseEntity.ok("Test path variable successful with id: " + id);
    }

    @GetMapping("/test-methods")
    public ResponseEntity<String> testMethods() {
        log.info("DEBUG: Test methods endpoint called");
        return ResponseEntity.ok("Supported methods: GET, POST, PUT, DELETE");
    }

    @GetMapping("/{proposalId}/test-accept/{swapEmployeeId}")
    public ResponseEntity<String> testAccept(@PathVariable Long proposalId, @PathVariable Long swapEmployeeId) {
        log.info("DEBUG: Test accept endpoint called with proposalId: " + proposalId + ", swapEmployeeId: " + swapEmployeeId);
        return ResponseEntity.ok("Test accept successful");
    }

    // Employee submits new swap change request, must include currentShiftId
    @PostMapping("/request-change")
    public ResponseEntity<SwapProposal> requestShiftChange(@RequestBody SwapProposal proposal) {
        log.info(logHeader + "requestShiftChange: Received swap change request from employee " + proposal.getEmployeeId());
        SwapProposal savedProposal = proposalService.createProposal(proposal);
        return ResponseEntity.ok(savedProposal);
    }

    // Manager accepts swap change request and specifies the swap employee id as a request parameter
    @PutMapping("/{proposalId}/accept-change/{swapEmployeeId}")
    public ResponseEntity<SwapProposal> acceptShiftChange(@PathVariable Long proposalId, @PathVariable Long swapEmployeeId) {
        try {
            log.info("DEBUG: Starting acceptShiftChange with proposalId=" + proposalId + ", swapEmployeeId=" + swapEmployeeId);
            SwapProposal updatedProposal = proposalService.acceptShiftChange(proposalId, swapEmployeeId);
            log.info("DEBUG: Successfully completed acceptShiftChange");
            return ResponseEntity.ok(updatedProposal);
        } catch (Exception e) {
            log.error("DEBUG: Error in controller: " + e.getMessage(), e);
            throw e;
        }
    }

    /*@PutMapping("/{proposalId}/accept-change/{swapEmployeeId}")
    public ResponseEntity<String> acceptShiftChange(@PathVariable Long proposalId, @PathVariable Long swapEmployeeId) {
        try {
            log.info("DEBUG: Starting acceptShiftChange with proposalId=" + proposalId + ", swapEmployeeId=" + swapEmployeeId);
            //SwapProposal updatedProposal = proposalService.acceptShiftChange(proposalId, swapEmployeeId);
            log.info("DEBUG: Successfully completed acceptShiftChange");
            return ResponseEntity.ok("Test successful with proposalId=" + proposalId + ", swapEmployeeId=" + swapEmployeeId);
        } catch (Exception e) {
            log.error("DEBUG: Error in controller: " + e.getMessage(), e);
            throw e;
        }
    }*/

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
