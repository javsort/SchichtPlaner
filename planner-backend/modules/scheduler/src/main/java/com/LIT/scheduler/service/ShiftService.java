package com.LIT.scheduler.service;

import java.util.List;
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

    private final String logHeader = "[ShiftService] - ";

    @Autowired
    public ShiftService(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
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
