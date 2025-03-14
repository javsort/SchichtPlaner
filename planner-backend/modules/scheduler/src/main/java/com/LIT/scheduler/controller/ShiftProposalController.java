package com.LIT.scheduler.controller;

import com.LIT.scheduler.model.entity.ShiftProposal;
import com.LIT.scheduler.service.ShiftProposalService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
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

    // Employee submits new shift proposal
    @PostMapping("/create")
    public ResponseEntity<ShiftProposal> createProposal(@RequestBody ShiftProposal proposal, @RequestHeader("X-User-Role") String role, @RequestHeader("X-User-Name") String username) {
        log.info(logHeader + "createProposal: User with role: '" + role + "' and username: '" + username + "' is creating a new shift proposal");

        ShiftProposal savedProposal = proposalService.createProposal(proposal, role, username);
        return ResponseEntity.ok(savedProposal);
    }

    // Employee retrieves their proposal
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ShiftProposal>> getProposalsByEmployee(@PathVariable Long employeeId) {
        log.info(logHeader + "getProposalsByEmployee: Getting proposals for employee with id: " + employeeId);
        List<ShiftProposal> proposals = proposalService.getProposalsByEmployee(employeeId);

        return ResponseEntity.ok(proposals);
    }

    @PutMapping("/{proposalId}/update")
    public ResponseEntity<ShiftProposal> updateProposal(@PathVariable Long proposalId, @RequestBody ShiftProposal updatedProposal) {
        log.info(logHeader + "Employee updated proposal with id: " + proposalId);
        ShiftProposal proposal = proposalService.updateProposal(proposalId, updatedProposal);
        return ResponseEntity.ok(proposal);
    }

    @DeleteMapping("/{proposalId}/cancel")
    public ResponseEntity<ShiftProposal> cancelProposal(@PathVariable Long proposalId) {
        log.info(logHeader + "Employee cancelled proposal with id: " + proposalId);
        ShiftProposal updatedProposal = proposalService.cancelProposal(proposalId);
        return ResponseEntity.ok(updatedProposal);
    }

    // Manager retrieves all proposals
    @GetMapping
    public ResponseEntity<List<ShiftProposal>> getAllProposals(@RequestHeader("X-User-Role") String role) {
        log.info(logHeader + "getAllProposals: Getting all proposals");

        if(!role.equals("ROLE_Admin") && !role.equals("ROLE_Shift-Supervisor")) {
            log.error(logHeader + "User is not authorized to view all proposals");
            return ResponseEntity.status(403).build();
        }
        
        log.info(logHeader + "getAllProposals: Role has been verified, proceeding to get all proposals for: " + role);

        List<ShiftProposal> proposals = proposalService.getAllProposals();


        return ResponseEntity.ok(proposals);
    }

    // Manager accepts proposal
    @PutMapping("/{proposalId}/accept")
    public ResponseEntity<ShiftProposal> acceptProposal(@PathVariable Long proposalId) {
        log.info(logHeader + "Manager accepted proposal with id: " + proposalId);
        ShiftProposal updatedProposal = proposalService.acceptProposal(proposalId);
        return ResponseEntity.ok(updatedProposal);
    }

    // Manager rejects proposal
    @PutMapping("/{proposalId}/reject")
    public ResponseEntity<ShiftProposal> rejectProposal(@PathVariable Long proposalId,
                                                        @RequestBody(required = false) String managerComment) {
        log.info(logHeader + "Manager rejected proposal with id: " + proposalId);
        ShiftProposal updatedProposal = proposalService.rejectProposal(proposalId, managerComment);
        return ResponseEntity.ok(updatedProposal);
    }

    // Manager proposes alternative
    @PutMapping("/{proposalId}/alternative")
    public ResponseEntity<ShiftProposal> proposeAlternative(@PathVariable Long proposalId,
                                                            @RequestBody ShiftProposal alternativeDetails) {
        log.info(logHeader + "Manager proposed alternative for proposal with id: " + proposalId);
        ShiftProposal updatedProposal = proposalService.proposeAlternative(proposalId, alternativeDetails);
        return ResponseEntity.ok(updatedProposal);
    }

    // Manager retrieves shift proposal reports in CSV
    @GetMapping("/reports/csv")
    public ResponseEntity<String> getProposalsReportCsv() {
        log.info(logHeader + "getProposalsReportCsv: Generating CSV report for shift proposals");
        String csvReport = proposalService.getProposalsReportCsv();
        return ResponseEntity.ok(csvReport);
    }
}
