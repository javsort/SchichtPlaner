package com.LIT.scheduler.model.entity;

import java.time.LocalDateTime;
import java.util.List;
import com.LIT.auth.model.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "shifts")
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @ManyToMany // Assuming a Many-to-Many relationship between Shift and User
    @JoinTable(
        name = "shift_users",
        joinColumns = @JoinColumn(name = "shift_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> assignedEmployees;

    private int minimumRequiredEmployees;
}
