package com.LIT.statistics.service;

import com.LIT.statistics.model.dto.ShiftReportDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@Slf4j
public class ReportsService {

    private final ShiftStatsService shiftStatsService;
    private final ObjectMapper objectMapper;
    private final String logHeader = "[ReportsService] - ";

    @Autowired
    public ReportsService(ShiftStatsService shiftStatsService, ObjectMapper objectMapper) {
        this.shiftStatsService = shiftStatsService;
        this.objectMapper = objectMapper;
        log.info(logHeader + "ReportsService created");
    }

    // Returns reports as CSV
    public String getReportsCsv() {
        List<ShiftReportDTO> reports = shiftStatsService.getShiftReports();
        StringBuilder sb = new StringBuilder();
        // CSV header
        sb.append("employeeId,employeeName,totalShifts,weekendShifts,lateShifts\n");
        for (ShiftReportDTO report : reports) {
            sb.append(report.getEmployeeId()).append(",");
            sb.append("\"").append(report.getEmployeeName()).append("\",");
            sb.append(report.getTotalShifts()).append(",");
            sb.append(report.getWeekendShifts()).append(",");
            sb.append(report.getLateShifts()).append("\n");
        }
        log.info(logHeader + "Generated CSV reports");
        return sb.toString();
    }

    // Returns reports as excel file
    public byte[] getReportsExcel() {
        List<ShiftReportDTO> reports = shiftStatsService.getShiftReports();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Shift Reports");

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"employeeId", "employeeName", "totalShifts", "weekendShifts", "lateShifts"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }
            log.info(logHeader + "Excel header row created");

            // Populate data rows
            int rowNum = 1;
            for (ShiftReportDTO report : reports) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(report.getEmployeeId());
                row.createCell(1).setCellValue(report.getEmployeeName());
                row.createCell(2).setCellValue(report.getTotalShifts());
                row.createCell(3).setCellValue(report.getWeekendShifts());
                row.createCell(4).setCellValue(report.getLateShifts());
            }
            log.info(logHeader + "Excel data rows populated");

            // Auto-size columns for better readability
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            log.info(logHeader + "Excel columns auto-sized");

            // Write the workbook to a byte array output stream
            try (ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
                workbook.write(bos);
                log.info(logHeader + "Generated Excel reports successfully");
                return bos.toByteArray();
            }
        } catch (Exception e) {
            log.error(logHeader + "Error generating Excel reports", e);
            throw new RuntimeException("Error generating Excel reports", e);
        }
    }
}
