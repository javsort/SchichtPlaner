package com.LIT.scheduler.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.repository.ShiftRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ShiftService {
    private final ShiftRepository shiftRepository;
    private final NotificationService notificationService;

    private final String logHeader = "[ShiftService] - ";

    @Autowired
    public ShiftService(ShiftRepository shiftRepository, NotificationService notificationService) {
        this.shiftRepository = shiftRepository;
        this.notificationService = notificationService;
    }

    /*@PostConstruct
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
    }*/

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
            
            Shift savedShift = shiftRepository.save(shift);
            log.info(logHeader + "saveShift: Shift saved successfully for employee with id: " 
                    + savedShift.getShiftOwnerId() + " and role: " + savedShift.getShiftOwnerRole());
            
            // Prepare email details for the saved shift
            String recipientEmail = getEmployeeEmail(savedShift.getShiftOwnerId());
            String subject = "New Shift Assigned";
            String message = "Dear Employee, your new shift '" + savedShift.getTitle() + "' " +
                            "has been assigned to you from " + savedShift.getStartTime() + " to " +
                            savedShift.getEndTime() + ".";
            
            // Send email notification
            notificationService.sendEmail(recipientEmail, subject, message);


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

            Shift savedShift = shiftRepository.save(existingShift);
            log.info(logHeader + "updateShift: Shift updated successfully");

            // Send email notification after updating the shift
            String recipientEmail = getEmployeeEmail(savedShift.getShiftOwnerId());
            String subject = "Shift Updated";
            String message = "Dear Employee, your shift '" + savedShift.getTitle() + "' has been updated. " +
                             "New schedule: from " + savedShift.getStartTime() + " to " + savedShift.getEndTime() + ".";
            notificationService.sendEmail(recipientEmail, subject, message);
    
            log.info(logHeader + "updateShift: Shift updated successfully");
            return shiftRepository.save(existingShift);
        } else {
            log.error(logHeader + "updateShift: Shift not found with id: " + id);
            throw new RuntimeException("Shift not found with id: " + id);
        }
    }

    public void deleteShift(Long id) {
        log.info(logHeader + "deleteShift: Deleting shift with id: " + id);
        Optional<Shift> optionalShift = shiftRepository.findById(id);
        if (optionalShift.isPresent()) {
            Shift shiftToDelete = optionalShift.get();
            
            // Send email notification before deleting the shift
            String recipientEmail = getEmployeeEmail(shiftToDelete.getShiftOwnerId());
            String subject = "Shift Deleted";
            String message = "Dear Employee, your shift '" + shiftToDelete.getTitle() + "' scheduled from " +
                             shiftToDelete.getStartTime() + " to " + shiftToDelete.getEndTime() +
                             " has been deleted.";
            notificationService.sendEmail(recipientEmail, subject, message);
            
            shiftRepository.deleteById(id);
            log.info(logHeader + "deleteShift: Shift deleted successfully.");
        } else {
            log.error(logHeader + "deleteShift: Shift not found with id: " + id);
        }
    }

    private String getEmployeeEmail(Long employeeId) {
        return "pekaric.edi1@gmail.com";
        //return userService.getUserById(employeeId)
        //                  .map(User::getEmail)
        //                  .orElse("eddie.pekaric@hotmail.com");
    }
}
