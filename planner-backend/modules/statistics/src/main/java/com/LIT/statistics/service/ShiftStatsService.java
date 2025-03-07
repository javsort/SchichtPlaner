package com.LIT.statistics.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.LIT.statistics.model.dto.ShiftReportDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Service
@Slf4j
public class ShiftStatsService {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public ShiftStatsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        log.info("ShiftStatsService created");
    }

    public List<ShiftReportDTO> getShiftReports() {
        String sql = "SELECT assigned_employee_id AS employeeId, " +
                     "       assigned_employee_name AS employeeName, " +
                     "       COUNT(*) AS totalShifts, " +
                     "       SUM(CASE WHEN DAYOFWEEK(startTime) IN (1,7) THEN 1 ELSE 0 END) AS weekendShifts, " +
                     "       SUM(CASE WHEN TIME(endTime) > '22:00:00' THEN 1 ELSE 0 END) AS lateShifts " +
                     "FROM shifts " +
                     "GROUP BY assigned_employee_id, assigned_employee_name";
        log.info("Executing shift reports query: {}", sql);
        List<ShiftReportDTO> reports = jdbcTemplate.query(sql, new ShiftReportRowMapper());
        log.info("Retrieved {} shift reports", reports.size());
        return reports;
    }

    private static class ShiftReportRowMapper implements RowMapper<ShiftReportDTO> {
        @Override
        public ShiftReportDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
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
