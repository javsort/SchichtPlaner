package com.LIT.statistics.service;

import com.LIT.statistics.model.dto.ShiftReportDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
@Slf4j
public class ShiftStatsService {

    private final JdbcTemplate jdbcTemplate;
    private final String logHeader = "[ShiftStatsService] - ";

    @Autowired
    public ShiftStatsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        log.info(logHeader + "ShiftStatsService created");
    }

    public List<ShiftReportDTO> getShiftReports() {
        String sql = "SELECT employee_id AS employeeId, " +
                     "       username AS employeeName, " +
                     "       COUNT(*) AS totalShifts, " +
                     "       SUM(CASE WHEN DAYOFWEEK(startTime) IN (1,7) THEN 1 ELSE 0 END) AS weekendShifts, " +
                     "       SUM(CASE WHEN TIME(endTime) > '22:00:00' THEN 1 ELSE 0 END) AS lateShifts " +
                     "FROM shifts " +
                     "GROUP BY employee_id, username";
        log.info(logHeader + "Executing shift reports query: {}", sql);
        List<ShiftReportDTO> reports = jdbcTemplate.query(sql, new ShiftReportRowMapper(logHeader));
        log.info(logHeader + "Retrieved {} shift reports", reports.size());
        return reports;
    }

    private static class ShiftReportRowMapper implements RowMapper<ShiftReportDTO> {
        private final String logHeader;

        public ShiftReportRowMapper(String logHeader) {
            this.logHeader = logHeader;
        }

        @Override
        public ShiftReportDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            log.info(logHeader + "Mapping row {} to ShiftReportDTO", rowNum);
            return ShiftReportDTO.builder()
                    .employeeId(rs.getLong("employeeId"))
                    .employeeName(rs.getString("employeeName"))
                    .totalShifts(rs.getLong("totalShifts"))
                    .weekendShifts(rs.getLong("weekendShifts"))
                    .lateShifts(rs.getLong("lateShifts"))
                    .build();
        }
    }
}
