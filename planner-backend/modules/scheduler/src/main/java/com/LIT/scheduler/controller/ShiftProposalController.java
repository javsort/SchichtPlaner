package com.LIT.scheduler.controller;

import com.LIT.scheduler.model.entity.ShiftProposal;
import com.LIT.scheduler.service.ShiftProposalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduler/shift-proposals")
public class ShiftProposalController {

    private final ShiftProposalService proposalService;

    public ShiftProposalController(ShiftProposalService proposalService) {
        this.proposalService = proposalService;
    }

    // Employee submits new shift proposal
    @PostMapping
    public ResponseEntity<ShiftProposal> createProposal(@RequestBody ShiftProposal proposal) {
        ShiftProposal savedProposal = proposalService.createProposal(proposal);
        return ResponseEntity.ok(savedProposal);
    }

    // Employee retrieves their proposal
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ShiftProposal>> getProposalsByEmployee(@PathVariable Long employeeId) {
        List<ShiftProposal> proposals = proposalService.getProposalsByEmployee(employeeId);
        return ResponseEntity.ok(proposals);
    }

    // Manager retrieves all proposals
    @GetMapping
    public ResponseEntity<List<ShiftProposal>> getAllProposals() {
        List<ShiftProposal> proposals = proposalService.getAllProposals();
        return ResponseEntity.ok(proposals);
    }

    // Manager accepts proposal
    @PutMapping("/{proposalId}/accept")
    public ResponseEntity<ShiftProposal> acceptProposal(@PathVariable Long proposalId) {
        ShiftProposal updatedProposal = proposalService.acceptProposal(proposalId);
        return ResponseEntity.ok(updatedProposal);
    }

    // Manager rejects proposal
    @PutMapping("/{proposalId}/reject")
    public ResponseEntity<ShiftProposal> rejectProposal(@PathVariable Long proposalId,
                                                        @RequestBody(required = false) String managerComment) {
        ShiftProposal updatedProposal = proposalService.rejectProposal(proposalId, managerComment);
        return ResponseEntity.ok(updatedProposal);
    }

    // Manager proposes alternative
    @PutMapping("/{proposalId}/alternative")
    public ResponseEntity<ShiftProposal> proposeAlternative(@PathVariable Long proposalId,
                                                            @RequestBody ShiftProposal alternativeDetails) {
        ShiftProposal updatedProposal = proposalService.proposeAlternative(proposalId, alternativeDetails);
        return ResponseEntity.ok(updatedProposal);
    }
}

