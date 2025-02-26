package com.LIT.scheduler.service;

import com.LIT.scheduler.model.repository.ShiftRepository;

/**
 * Checks for shifts due in 7 days and triggers notifications if staffing is below the minimum.
 */
public class ShiftScheduler {

    private final ShiftRepository shiftRepository;

    public ShiftScheduler(ShiftRepository shiftRepository) {
        this.shiftRepository = shiftRepository;
    }
    
    /*public void checkShiftsForUnderStaffing() {
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sevenDaysFromNow = now.plusDays(7);
        
        List<Shift> upcomingShifts = shiftRepository.findByStartTimeBetween(now, sevenDaysFromNow);

        for (Shift shift : upcomingShifts) {
            if (shift.getAssignedEmployees().size() < shift.getMinimumRequiredEmployees()) {

                // Retrieve a user with the Manager role from the UserRepository.
                Optional<User> managerOpt = userRepository.findFirstByRoles_Name("Manager");

                if (managerOpt.isPresent()) {
                    notificationService.notifyManagerForShiftShortage(managerOpt.get(), shift);
                }
            }
        }
    }*/
}
