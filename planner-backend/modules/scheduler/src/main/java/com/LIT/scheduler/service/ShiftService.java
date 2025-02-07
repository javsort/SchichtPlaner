package com.LIT.scheduler.service;

import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.repository.ShiftRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ShiftService {
    private final ShiftRepository shiftRepository;

    public ShiftService(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    public Optional<Shift> getShiftById(Long id) {
        return shiftRepository.findById(id);
    }

    public Shift saveShift(Shift shift) {
        return shiftRepository.save(shift);
    }

    public Shift updateShift(Long id, Shift updatedShift) {
        Optional<Shift> optionalShift = shiftRepository.findById(id);
        if (optionalShift.isPresent()) {
            Shift existingShift = optionalShift.get();
            existingShift.setTitle(updatedShift.getTitle());
            existingShift.setStartTime(updatedShift.getStartTime());
            existingShift.setEndTime(updatedShift.getEndTime());
            return shiftRepository.save(existingShift);
        } else {
            throw new RuntimeException("Shift not found with id: " + id);
        }
    }

    public void deleteShift(Long id) {
        shiftRepository.deleteById(id);
    }
}
