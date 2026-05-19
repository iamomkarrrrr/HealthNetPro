package com.healthnet.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.PasswordResetOtp;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

	Optional<PasswordResetOtp> findTopByEmailOrderByCreatedAtDesc(String email);
}