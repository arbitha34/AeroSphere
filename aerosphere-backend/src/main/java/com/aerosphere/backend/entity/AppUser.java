package com.aerosphere.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "app_users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {

    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;
    private String passwordHash;
    private String role;
    private String avatarInitial;
}
