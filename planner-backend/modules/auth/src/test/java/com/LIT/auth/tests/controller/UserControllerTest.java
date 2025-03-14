package com.LIT.auth.tests.controller;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.LIT.auth.controller.UserController;
import com.LIT.auth.service.UserService;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    /*
     * Test user deletion (Only Admin can delete users)
     */
    // Test the delete user endpoint -> with ADMIN (should succeed)
    @Test
    @DisplayName("DELETE /api/auth/users/{id} with ROLE_Admin should succeed")
    void deleteUserAsAdminShouldReturnNoContent() throws Exception {
        // Given: we do not actually perform deletion, so mock it to do nothing
        Mockito.doNothing().when(userService).deleteUser(anyLong());

        mockMvc.perform(
                delete("/api/auth/users/{id}", 1L)
                  .header("X-User-Role", "ROLE_Admin")
        )
        .andExpect(status().isNoContent());
    }

    // Test the delete user endpoint -> with Shift-Supervisor (should fail)
    @Test
    @DisplayName("DELETE /api/auth/users/{id} with ROLE_Shift-Supervisor should fail with 400")
    void deleteUserAsShiftSupervisorShouldReturnBadRequest() throws Exception {
        // Given: same mocking, still do nothing
        Mockito.doNothing().when(userService).deleteUser(anyLong());

        mockMvc.perform(
                delete("/api/auth/users/{id}", 1L)
                  .header("X-User-Role", "ROLE_Shift-Supervisor")
        )
        .andExpect(status().isBadRequest());
    }

    /*
     * Test getting user info (Only Admin & Shift-Supervisor can get user info)
     */
    // Test getting user info -> with Admin (should succeed)
    @Test
    @DisplayName("GET /api/auth/users/{id} with ROLE_Admin should succeed")
    void getUserInfoAsAdminShouldReturnOk() throws Exception {
        // Given: mock the user service to return an empty optional
        Mockito.when(userService.getUserById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(
                get("/api/auth/users/{id}", 1L)
                  .header("X-User-Role", "ROLE_Admin")
        )
        .andExpect(status().isNotFound());
    }

    // Test getting user info -> with Shift-Supervisor (should succeed)  
    @Test
    @DisplayName("GET /api/auth/users/{id} with ROLE_Shift-Supervisor should succeed")
    void getUserInfoAsShiftSupervisorShouldReturnOk() throws Exception {
        // Given: mock the user service to return an empty optional
        Mockito.when(userService.getUserById(anyLong())).thenReturn(Optional.empty());

        mockMvc.perform(
                get("/api/auth/users/{id}", 1L)
                  .header("X-User-Role", "ROLE_Shift-Supervisor")
        )
        .andExpect(status().isNotFound());
    }

    // Test getting user info -> with Technician role
    @Test
    @DisplayName("GET /api/auth/users/{id} with ROLE_Technician should fail with 400")
    void getUserInfoAsTechnicianShouldReturnBadRequest() throws Exception {
        // Given: mock the user service to return an empty optional
        Mockito.when(userService.getUserById(anyLong())).thenReturn(Optional.empty());


        mockMvc.perform(
                get("/api/auth/users/{id}", 1L)
                  .header("X-User-Role", "ROLE_Technician")
        )
        .andExpect(status().isBadRequest());
    }   

}
