package com.aerosphere.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private String token;
    private String refreshToken;
    private String avatarInitial;
}
