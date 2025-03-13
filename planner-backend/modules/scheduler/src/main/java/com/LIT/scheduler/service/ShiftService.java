package com.LIT.scheduler.service;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import java.util.Optional;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.repository.ShiftRepository;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ShiftService {
    private final ShiftRepository shiftRepository;

    private final String logHeader = "[ShiftService] - ";

    @Autowired
    public ShiftService(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    @PostConstruct
    public void initializeDummyShifts() {
        log.info(logHeader + "initializeDummyShifts: Initializing dummy shifts. Starting with shifts...");

        if (shiftRepository.count() == 0) {
            shiftRepository.saveAll(List.of(
                Shift.builder()
                    .title("Test Shift I")
                    .shiftOwnerId(1L)
                    .shiftOwnerName("Test Owner")
                    .shiftOwnerRole("Tester")
                    .startTime(LocalDateTime.of(2025, Month.MARCH, 10, 8, 0))
                    .endTime(LocalDateTime.of(2025, Month.MARCH, 10, 16, 0))
                    .build(),
                Shift.builder()
                    .title("Test Shift II")
                    .shiftOwnerId(1L)
                    .shiftOwnerName("Test Owner II")
                    .shiftOwnerRole("Technician")
                    .startTime(LocalDateTime.of(2025, Month.MARCH, 11, 8, 0))
                    .endTime(LocalDateTime.of(2025, Month.MARCH, 11, 16, 0))
                    .build(),
                Shift.builder()
                    .title("Test Shift III")
                    .shiftOwnerId(1L)
                    .shiftOwnerName("Test Owner III")
                    .shiftOwnerRole("Incident-Manager")
                    .startTime(LocalDateTime.of(2025, Month.MARCH, 12, 8, 0))
                    .endTime(LocalDateTime.of(2025, Month.MARCH, 12, 16, 0))
                    .build()
            ));
        }
    }

    public List<Shift> getAllShifts() {
        log.info(logHeader + "getAllShifts: Getting all shifts");
        return shiftRepository.findAll();
    }

    public Optional<Shift> getShiftById(Long id) {
        log.info(logHeader + "getShiftById: Getting shift with id: " + id);
        return shiftRepository.findById(id);
    }

    public Shift saveShift(Shift shift) {
        log.info(logHeader + "saveShift: Saving new shift");

        if (shift.getShiftOwnerId() != null) {
            log.info(logHeader + "saveShift: Shift saved successfully for employee with id: " + shift.getShiftOwnerId() + " and role: " + shift.getShiftOwnerRole());
            return shiftRepository.save(shift);
        
        } else {
            log.error(logHeader + "saveShift: Shift not saved successfully. Employee ID is NULL");
            return null;
        }
    }

    public Shift updateShift(Long id, Shift updatedShift) {
        log.info(logHeader + "updateShift: Updating shift with id: " + id);
        Optional<Shift> optionalShift = shiftRepository.findById(id);
    
        if (optionalShift.isPresent()) {
            log.info(logHeader + "updateShift: Shift found with id: " + id + ". Proceeding to update...");
            Shift existingShift = optionalShift.get();
            existingShift.setTitle(updatedShift.getTitle());
            existingShift.setStartTime(updatedShift.getStartTime());
            existingShift.setEndTime(updatedShift.getEndTime());
            existingShift.setShiftOwnerId(updatedShift.getShiftOwnerId());
    
            // Update owner name and role if employeeId is changed
            if (!Objects.equals(existingShift.getShiftOwnerId(), updatedShift.getShiftOwnerId())) {
                if (updatedShift.getShiftOwnerId() != null) {
                    existingShift.setShiftOwnerName(updatedShift.getShiftOwnerName());
                    existingShift.setShiftOwnerRole(updatedShift.getShiftOwnerRole());
                } else {
                    existingShift.setShiftOwnerName("Unassigned");
                    existingShift.setShiftOwnerRole("Unassigned");
                }
            }
    
            log.info(logHeader + "updateShift: Shift updated successfully");
            return shiftRepository.save(existingShift);
        } else {
            log.error(logHeader + "updateShift: Shift not found with id: " + id);
            throw new RuntimeException("Shift not found with id: " + id);
        }
    }

    public void deleteShift(Long id) {
        log.info(logHeader + "deleteShift: Deleting shift with id: " + id);
        shiftRepository.deleteById(id);
    }
}
