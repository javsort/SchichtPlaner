package com.LIT.scheduler.exception;

public class ShiftConflictException extends RuntimeException {
    public ShiftConflictException(String message) {
        super(message);
    }
}

