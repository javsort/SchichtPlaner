package com.LIT.scheduler.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.LIT.auth.model.entity.User;
import com.LIT.auth.model.repository.UserRepository;
import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.repository.ShiftRepository;

/**
 * Checks for shifts due in 7 days and triggers notifications if staffing is below the minimum.
 */
public class ShiftScheduler {

    private final EmailNotificationService notificationService;
    private final ShiftRepository shiftRepository;
    private final UserRepository userRepository;

    public ShiftScheduler(EmailNotificationService notificationService,
                          ShiftRepository shiftRepository,
                          UserRepository userRepository) {
        this.notificationService = notificationService;
        this.shiftRepository = shiftRepository;
        this.userRepository = userRepository;
    }
    
    public void checkShiftsForUnderStaffing() {
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
    }
}
