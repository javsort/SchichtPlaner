package com.LIT.scheduler;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.LIT.scheduler.model.entity.Shift;
import com.LIT.scheduler.model.repository.ShiftRepository;
import com.LIT.scheduler.service.AuthUserService;
import com.LIT.scheduler.service.ShiftService;
import com.LIT.scheduler.service.NotificationService;

@ExtendWith(MockitoExtension.class)
public class ShiftServiceTest {

    @Mock
    private ShiftRepository shiftRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private AuthUserService authUserService;

    @InjectMocks
    private ShiftService shiftService;

    private Shift sampleShift;

    @BeforeEach
    public void setUp() {
        sampleShift = new Shift();
        sampleShift.setId(1L);
        sampleShift.setShiftOwnerId(3L);
        sampleShift.setTitle("Morning Shift");
        sampleShift.setShiftOwnerName("Technician");
        sampleShift.setShiftOwnerRole("Technician");
        sampleShift.setStartTime(LocalDateTime.of(2025, 3, 25, 7, 0));
        sampleShift.setEndTime(LocalDateTime.of(2025, 3, 25, 15, 0));
    }

    @Test
    public void testGetAllShifts() {
        when(shiftRepository.findAll()).thenReturn(Arrays.asList(sampleShift));
        List<Shift> shifts = shiftService.getAllShifts();
        assertNotNull(shifts);
        assertEquals(1, shifts.size());
        verify(shiftRepository, times(1)).findAll();
    }

    @Test
    public void testGetShiftByIdFound() {
        when(shiftRepository.findById(1L)).thenReturn(Optional.of(sampleShift));
        Optional<Shift> shiftOpt = shiftService.getShiftById(1L);
        assertTrue(shiftOpt.isPresent());
        assertEquals("Morning Shift", shiftOpt.get().getTitle());
    }

    @Test
    public void testSaveShift_Success() {
        // Simulate valid shift owner id and email retrieval via AuthUserService
        when(authUserService.getUserEmailById(3L)).thenReturn("test@example.com");
        when(shiftRepository.save(any(Shift.class))).thenReturn(sampleShift);

        Shift savedShift = shiftService.saveShift(sampleShift);
        assertNotNull(savedShift);
        verify(shiftRepository, times(1)).save(sampleShift);
        // Verify notification was sent
        verify(notificationService, times(1))
            .sendEmail(eq("test@example.com"), eq("New Shift Assigned"), contains("Morning Shift"));
    }

    @Test
    public void testUpdateShift_Success() {
        Shift updatedShift = new Shift();
        updatedShift.setTitle("Evening Shift");
        updatedShift.setStartTime(LocalDateTime.of(2025, 3, 25, 15, 0));
        updatedShift.setEndTime(LocalDateTime.of(2025, 3, 25, 23, 0));
        updatedShift.setShiftOwnerId(3L);
        updatedShift.setShiftOwnerName("Technician");
        updatedShift.setShiftOwnerRole("Technician");

        when(shiftRepository.findById(1L)).thenReturn(Optional.of(sampleShift));
        when(shiftRepository.save(any(Shift.class))).thenReturn(updatedShift);
        when(authUserService.getUserEmailById(3L)).thenReturn("test@example.com");

        Shift result = shiftService.updateShift(1L, updatedShift);
        assertNotNull(result);
        assertEquals("Evening Shift", result.getTitle());
        // Verify notification was sent after update
        verify(notificationService, times(1))
            .sendEmail(eq("test@example.com"), eq("Shift Updated"), contains("Evening Shift"));
    }

    @Test
    public void testDeleteShift_Success() {
        when(shiftRepository.findById(1L)).thenReturn(Optional.of(sampleShift));
        when(authUserService.getUserEmailById(3L)).thenReturn("test@example.com");

        shiftService.deleteShift(1L);
        verify(shiftRepository, times(1)).deleteById(1L);
        verify(notificationService, times(1))
            .sendEmail(eq("test@example.com"), eq("Shift Deleted"), contains("Morning Shift"));
    }
}
