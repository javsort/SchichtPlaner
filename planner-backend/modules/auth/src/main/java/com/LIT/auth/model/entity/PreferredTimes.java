package com.LIT.auth.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "preferred_times")
public class PreferredTimes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String preferredDay;

    @Column(nullable = false)
    private String preferredTime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}