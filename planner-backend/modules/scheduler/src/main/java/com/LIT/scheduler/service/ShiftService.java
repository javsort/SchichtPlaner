package com.LIT.scheduler.service;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import java.util.Optional;

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
                .title("Test Shift")
                .startTime(LocalDateTime.of(2025, Month.MARCH, 5, 8, 0))
                .endTime(LocalDateTime.of(2025, Month.MARCH, 5, 16, 0))
                .build(),
            Shift.builder()
                .title("Test Shift II")
                .startTime(LocalDateTime.of(2025, Month.MARCH, 6, 8, 0))
                .endTime(LocalDateTime.of(2025, Month.MARCH, 6, 16, 0))
                .build(),
            Shift.builder()
                .title("Test Shift III")
                .startTime(LocalDateTime.of(2025, Month.MARCH, 7, 8, 0))
                .endTime(LocalDateTime.of(2025, Month.MARCH, 7, 16, 0))
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
        return shiftRepository.save(shift);
    }

    public Shift updateShift(Long id, Shift updatedShift) {
        log.info(logHeader + "updateShift: Updating shift with id: " + id);
        Optional<Shift> optionalShift = shiftRepository.findById(id);

        if (optionalShift.isPresent()) {
            log.info(logHeader + "updateShift: Shift found with id: " + id);

            Shift existingShift = optionalShift.get();
            existingShift.setTitle(updatedShift.getTitle());
            existingShift.setStartTime(updatedShift.getStartTime());
            existingShift.setEndTime(updatedShift.getEndTime());

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
