package com.LIT.statistics.unittests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import com.LIT.statistics.model.dto.ShiftReportDTO;
import com.LIT.statistics.service.ReportsService;
import com.LIT.statistics.service.ShiftStatsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import java.util.Arrays;
import java.util.List;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class ReportServiceTest {

    @Mock
    private ShiftStatsService shiftStatsService;

    // ObjectMapper for the ReportsService constructor.
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private ReportsService reportsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetReportsCsv() {
        // Sample data
        ShiftReportDTO report1 = new ShiftReportDTO();
        report1.setEmployeeId(1L);
        report1.setEmployeeName("John Smith");
        report1.setTotalShifts(10L);      
        report1.setWeekendShifts(2L);      
        report1.setLateShifts(1L);

        ShiftReportDTO report2 = new ShiftReportDTO();
        report2.setEmployeeId(2L);
        report2.setEmployeeName("Jane Smithson");
        report2.setTotalShifts(8L);       
        report2.setWeekendShifts(1L);      
        report2.setLateShifts(0L);     

        List<ShiftReportDTO> reportsList = Arrays.asList(report1, report2);
        when(shiftStatsService.getShiftReports()).thenReturn(reportsList);

        // When
        String csvOutput = reportsService.getReportsCsv();

        // Verify that CSV output is not null and starts with the expected header
        assertNotNull(csvOutput);
        assertTrue(csvOutput.startsWith("employeeId,employeeName,totalShifts,weekendShifts,lateShifts"),
                   "CSV output should start with the expected header");
        // Verify data rows
        assertTrue(csvOutput.contains("1,"), "CSV output should contain employee id 1");
        assertTrue(csvOutput.contains("\"John Smith\""), "CSV output should contain employee name John Smith");
        assertTrue(csvOutput.contains("10"), "CSV output should contain total shifts 10");
        assertTrue(csvOutput.contains("2,"), "CSV output should contain employee id 2");
        assertTrue(csvOutput.contains("\"Jane Smithson\""), "CSV output should contain employee name Jane Smithson");
        assertTrue(csvOutput.contains("8"), "CSV output should contain total shifts 8");
    }

    @Test
    void testGetReportsExcel() throws Exception {
        // Sample data
        ShiftReportDTO report = new ShiftReportDTO();
        report.setEmployeeId(1L);
        report.setEmployeeName("John Doe");
        report.setTotalShifts(10L);       
        report.setWeekendShifts(2L);      
        report.setLateShifts(1L);         

        List<ShiftReportDTO> reportsList = Arrays.asList(report);
        when(shiftStatsService.getShiftReports()).thenReturn(reportsList);

        // When
        byte[] excelBytes = reportsService.getReportsExcel();

        // Then
        assertNotNull(excelBytes);
        assertTrue(excelBytes.length > 0);

        // Read the generated Excel file from the byte array
        try (Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(excelBytes))) {
            Sheet sheet = workbook.getSheet("Shift Reports");
            assertNotNull(sheet, "Sheet 'Shift Reports' should exist");

            // Verify header row
            Row headerRow = sheet.getRow(0);
            assertNotNull(headerRow, "Header row should exist");
            assertEquals("employeeId", headerRow.getCell(0).getStringCellValue());
            assertEquals("employeeName", headerRow.getCell(1).getStringCellValue());
            assertEquals("totalShifts", headerRow.getCell(2).getStringCellValue());
            assertEquals("weekendShifts", headerRow.getCell(3).getStringCellValue());
            assertEquals("lateShifts", headerRow.getCell(4).getStringCellValue());

            // Verify first data row
            Row dataRow = sheet.getRow(1);
            assertNotNull(dataRow, "Data row should exist");
            assertEquals(1L, (long) dataRow.getCell(0).getNumericCellValue());
            assertEquals("John Doe", dataRow.getCell(1).getStringCellValue());
            // getNumericCellValue returns a double -> cast to long for comparison
            assertEquals(10L, (long) dataRow.getCell(2).getNumericCellValue());
            assertEquals(2L, (long) dataRow.getCell(3).getNumericCellValue());
            assertEquals(1L, (long) dataRow.getCell(4).getNumericCellValue());
        }
    }
}
