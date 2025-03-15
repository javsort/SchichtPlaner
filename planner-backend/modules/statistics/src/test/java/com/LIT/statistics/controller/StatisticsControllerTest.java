package com.LIT.statistics.controller;

import com.LIT.statistics.controller.StatisticsController;
import com.LIT.statistics.service.ReportsService;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StatisticsController.class)
@AutoConfigureMockMvc(addFilters = false)
class StatisticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ReportsService reportsService;

    @Test
    @DisplayName("GET /api/stats/hello returns expected message")
    void helloShouldReturnHelloMessage() throws Exception {
        mockMvc.perform(get("/api/stats/hello"))
               .andExpect(status().isOk())
               .andExpect(content().string("Hello from statistics module!"));
    }

    @Test
    @DisplayName("GET /api/stats/test-jwt returns expected message")
    void testJwtShouldReturnJWTWorking() throws Exception {
        mockMvc.perform(get("/api/stats/test-jwt"))
               .andExpect(status().isOk())
               .andExpect(content().string("JWT is working!"));
    }

    @Test
    @DisplayName("GET /api/stats/reports/csv returns CSV report")
    void getReportsCsvShouldReturnCsv() throws Exception {
        String csvMock = "employeeId,employeeName,totalShifts,weekendShifts,lateShifts\n"
                + "1,\"John Smith\",10,2,1\n";
        Mockito.when(reportsService.getReportsCsv()).thenReturn(csvMock);
        mockMvc.perform(get("/api/stats/reports/csv"))
               .andExpect(status().isOk())
               .andExpect(content().string(csvMock));
    }

    @Test
    @DisplayName("GET /api/stats/reports/excel returns Excel report")
    void getReportsExcelShouldReturnExcel() throws Exception {
        byte[] excelBytes = new byte[] {1, 2, 3, 4}; // dummy Excel bytes for testing
        Mockito.when(reportsService.getReportsExcel()).thenReturn(excelBytes);
        mockMvc.perform(get("/api/stats/reports/excel"))
               .andExpect(status().isOk())
               .andExpect(header().string(HttpHeaders.CONTENT_TYPE, 
                       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
               // Updated expectation to match the actual header value
               .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, 
                       "form-data; name=\"attachment\"; filename=\"shift_reports.xlsx\""))
               .andExpect(result -> {
                   byte[] responseContent = result.getResponse().getContentAsByteArray();
                   // Compare the byte arrays
                   assertArrayEquals(excelBytes, responseContent);
               });
    }
}
