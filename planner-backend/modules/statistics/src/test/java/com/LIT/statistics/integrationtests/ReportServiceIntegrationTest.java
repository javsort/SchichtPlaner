package com.LIT.statistics.integrationtests;

import static org.junit.jupiter.api.Assertions.*;

import com.LIT.statistics.model.dto.ShiftReportDTO;
import com.LIT.statistics.service.ReportsService;
import com.LIT.statistics.service.ShiftStatsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.ByteArrayInputStream;
import java.util.Arrays;
import java.util.List;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

/**
 * Integration test for ReportsService.
 * 
 * Test creates a dummy subclass of ShiftStatsService 
 * that returns fixed dummy data
 * and then verifies that ReportsService produces
 * the expected CSV and Excel reports.
 */
public class ReportServiceIntegrationTest {

    private ReportsService reportsService;
    private ShiftStatsService shiftStatsService;

    /**
     * Dummy implementation of ShiftStatsService.
     */
    private static class DummyShiftStatsService extends ShiftStatsService {
        public DummyShiftStatsService() {
            super(null);  // Pass dummy values if needed.
        }

        @Override
        public List<ShiftReportDTO> getShiftReports() {
            ShiftReportDTO report1 = new ShiftReportDTO();
            report1.setEmployeeId(1L);
            report1.setEmployeeName("Alice");
            report1.setTotalShifts(10L);
            report1.setWeekendShifts(3L);
            report1.setLateShifts(1L);

            ShiftReportDTO report2 = new ShiftReportDTO();
            report2.setEmployeeId(2L);
            report2.setEmployeeName("Bob");
            report2.setTotalShifts(8L);
            report2.setWeekendShifts(2L);
            report2.setLateShifts(0L);

            return Arrays.asList(report1, report2);
        }
    }

    @BeforeEach
    public void setUp() {
        // Instantiate the dummy ShiftStatsService
        shiftStatsService = new DummyShiftStatsService();
        // Create a real ObjectMapper
        ObjectMapper objectMapper = new ObjectMapper();
        // Instantiate the ReportsService with the dummy dependency
        reportsService = new ReportsService(shiftStatsService, objectMapper);
    }

    @Test
    public void testGetReportsCsvIntegration() {
        String csv = reportsService.getReportsCsv();
        assertNotNull(csv, "CSV report should not be null");
        // Check that CSV output starts with the expected header
        assertTrue(csv.startsWith("employeeId,employeeName,totalShifts,weekendShifts,lateShifts"),
                   "CSV report should start with the expected header");
        // Verify that the CSV contains dummy data
        assertTrue(csv.contains("Alice"), "CSV report should contain employee name 'Alice'");
        assertTrue(csv.contains("Bob"), "CSV report should contain employee name 'Bob'");
    }

    @Test
    public void testGetReportsExcelIntegration() throws Exception {
        byte[] excelBytes = reportsService.getReportsExcel();
        assertNotNull(excelBytes, "Excel report should not be null");
        assertTrue(excelBytes.length > 0, "Excel report should not be empty");

        // Use Apache POI to read the Excel file from the returned byte array
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

            // Verify the first data row corresponds to dummy report (Alice).
            Row dataRow = sheet.getRow(1);
            assertNotNull(dataRow, "Data row should exist");
            assertEquals(1L, (long) dataRow.getCell(0).getNumericCellValue());
            assertEquals("Alice", dataRow.getCell(1).getStringCellValue());
        }
    }
}
