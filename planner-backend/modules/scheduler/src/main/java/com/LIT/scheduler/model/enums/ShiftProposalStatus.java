package com.LIT.scheduler.model.enums;

public enum ShiftProposalStatus {
    PROPOSED,           // Proposed by employee, waiting for manager review
    ACCEPTED,           // Manager accepted, becomes official shift
    REJECTED,           // Manager rejected
    ALTERNATIVE_PROPOSED // Manager rejected, proposed alternative shift
}
