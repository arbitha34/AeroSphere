package com.aerosphere.backend.service;

import com.aerosphere.backend.dto.*;
import com.aerosphere.backend.entity.AppUser;
import com.aerosphere.backend.exception.ApiException;
import com.aerosphere.backend.repository.AppUserRepository;
import com.aerosphere.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Demo-grade in-memory OTP store: email -> [code, expiryEpochSeconds]. Swap for Redis in production.
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private static final SecureRandom RANDOM = new SecureRandom();

    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        String role = (request.getRole() == null || request.getRole().isBlank()) ? "Admin" : request.getRole();

        AppUser user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Demo behaviour: first sign-in with a new email auto-provisions the account,
            // matching the mocked frontend where "any email/password" signs you in.
            // Remove this branch and require pre-provisioned accounts for a production rollout.
            user = AppUser.builder()
                    .id("USR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .email(email)
                    .name(deriveNameFromEmail(email))
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .role(role)
                    .avatarInitial(deriveNameFromEmail(email).substring(0, 1).toUpperCase())
                    .build();
            userRepository.save(user);
        } else if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Incorrect email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), Map.of("role", user.getRole(), "name", user.getName()));
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        return LoginResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .refreshToken(refreshToken)
                .avatarInitial(user.getAvatarInitial())
                .build();
    }

    public RefreshTokenResponse refreshAccessToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtUtil.isRefreshToken(refreshToken)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        String email = jwtUtil.extractEmail(refreshToken);
        if (!jwtUtil.isTokenValid(refreshToken, email)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Refresh token has expired — please sign in again");
        }

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Account no longer exists"));

        String newToken = jwtUtil.generateToken(user.getEmail(), Map.of("role", user.getRole(), "name", user.getName()));
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getEmail()); // rotate refresh token

        return RefreshTokenResponse.builder().token(newToken).refreshToken(newRefreshToken).build();
    }

    public OtpResponse requestOtp(OtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        int expiresInSeconds = 300;
        otpStore.put(email, new OtpEntry(code, Instant.now().plusSeconds(expiresInSeconds)));

        // No email provider wired up in this demo — the code is logged instead of sent.
        log.info("AeroSphere password-reset OTP for {}: {}", email, code);

        return OtpResponse.builder().sent(true).email(email).expiresInSeconds(expiresInSeconds).build();
    }

    public VerifyOtpResponse verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        OtpEntry entry = otpStore.get(email);

        if (entry == null || Instant.now().isAfter(entry.expiry())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This code has expired. Please request a new one.");
        }
        if (!entry.code().equals(request.getCode())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Incorrect verification code.");
        }

        otpStore.remove(email);
        return VerifyOtpResponse.builder().verified(true).build();
    }

    public GenericResponse resetPassword(ResetPasswordRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }
        AppUser user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No account found for this email"));

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        return GenericResponse.builder().success(true).message("Password updated successfully").build();
    }

    private String deriveNameFromEmail(String email) {
        String local = email.split("@")[0].replace(".", " ").replace("_", " ");
        String[] parts = local.split(" ");
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (p.isBlank()) continue;
            sb.append(Character.toUpperCase(p.charAt(0))).append(p.substring(1)).append(" ");
        }
        return sb.toString().trim().isEmpty() ? "AeroSphere User" : sb.toString().trim();
    }

    private record OtpEntry(String code, Instant expiry) {}
}
