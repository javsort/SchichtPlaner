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
import java.util.Set;
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
@Table(name = "absences")
public class Absence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @ManyToOne
<<<<<<< Updated upstream
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
}
=======
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
>>>>>>> Stashed changes
