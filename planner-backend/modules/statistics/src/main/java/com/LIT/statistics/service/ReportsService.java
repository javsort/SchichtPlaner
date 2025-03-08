package com.LIT.statistics.service;

import com.LIT.statistics.model.dto.ShiftReportDTO;
import com.LIT.statistics.service.ShiftStatsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    // Returns reports as JSON
    public String getReportsJson() {
        try {
            List<ShiftReportDTO> reports = shiftStatsService.getShiftReports();
            String jsonOutput = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(reports);
            log.info(logHeader + "Generated JSON reports");
            return jsonOutput;
        } catch (Exception e) {
            log.error(logHeader + "Error generating JSON reports", e);
            throw new RuntimeException("Error generating JSON reports", e);
        }
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
}
