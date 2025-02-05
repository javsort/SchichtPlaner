package com.LIT.auth.model.entity;

<<<<<<< Updated upstream
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

=======
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

>>>>>>> Stashed changes
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
<<<<<<< Updated upstream
=======
@Builder
>>>>>>> Stashed changes
@Table(name = "shifts")
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String time;

    @ManyToOne
<<<<<<< Updated upstream
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee assignedTo;
=======
    @JoinColumn(name = "user_id", nullable = false)
    private User assignedTo;
>>>>>>> Stashed changes
}
