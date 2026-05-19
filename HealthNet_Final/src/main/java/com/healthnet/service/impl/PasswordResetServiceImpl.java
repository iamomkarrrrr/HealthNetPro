package com.healthnet.service.impl;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.healthnet.email.service.EmailService;
import com.healthnet.entity.PasswordResetOtp;
import com.healthnet.entity.User;
import com.healthnet.repository.PasswordResetOtpRepository;
import com.healthnet.repository.UserRepository;
import com.healthnet.resquestdto.ForgotPasswordRequestDTO;
import com.healthnet.resquestdto.ResetPasswordRequestDTO;
import com.healthnet.resquestdto.VerifyOtpRequestDTO;
import com.healthnet.service.PasswordResetService;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

	private static final int OTP_EXPIRY_MINUTES = 5;
	private static final int MAX_ATTEMPTS = 3;

	private final PasswordResetOtpRepository otpRepository;
	private final UserRepository userRepository;
	private final EmailService emailService;
	private final PasswordEncoder passwordEncoder;

	public PasswordResetServiceImpl(PasswordResetOtpRepository otpRepository, UserRepository userRepository,
			EmailService emailService, PasswordEncoder passwordEncoder) {
		this.otpRepository = otpRepository;
		this.userRepository = userRepository;
		this.emailService = emailService;
		this.passwordEncoder = passwordEncoder;
	}

	// 1️⃣ Request OTP
	@Override
	public void requestOtp(ForgotPasswordRequestDTO requestDTO) {

		String email = requestDTO.getEmail();

		// Check user exists (but do NOT expose result)
		userRepository.findByEmail(email).ifPresent(user -> {

			String otp = generateOtp();

			PasswordResetOtp resetOtp = PasswordResetOtp.builder().email(email).otp(otp)
					.expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES)).verified(false).used(false)
					.attemptCount(0).build();

			otpRepository.save(resetOtp);

			emailService.sendOtpEmail(email, otp);
		});

		// Always return success (avoid email enumeration)
	}

	// 2️⃣ Verify OTP
	@Override
	public void verifyOtp(VerifyOtpRequestDTO requestDTO) {

		PasswordResetOtp otpRecord = otpRepository.findTopByEmailOrderByCreatedAtDesc(requestDTO.getEmail())
				.orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

		if (otpRecord.isUsed() || otpRecord.isVerified()) {
			throw new RuntimeException("OTP already used or verified");
		}

		if (otpRecord.getExpiresAt().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("OTP expired");
		}

		if (otpRecord.getAttemptCount() >= MAX_ATTEMPTS) {
			throw new RuntimeException("Maximum OTP attempts exceeded");
		}

		if (!otpRecord.getOtp().equals(requestDTO.getOtp())) {
			otpRecord.setAttemptCount(otpRecord.getAttemptCount() + 1);
			otpRepository.save(otpRecord);
			throw new RuntimeException("Invalid OTP");
		}

		otpRecord.setVerified(true);
		otpRepository.save(otpRecord);
	}

	// 3️⃣ Reset Password
	@Override
	public void resetPassword(ResetPasswordRequestDTO requestDTO) {

		PasswordResetOtp otpRecord = otpRepository.findTopByEmailOrderByCreatedAtDesc(requestDTO.getEmail())
				.orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

		if (!otpRecord.isVerified() || otpRecord.isUsed()) {
			throw new RuntimeException("OTP not verified or already used");
		}

		User user = userRepository.findByEmail(requestDTO.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found"));

		user.setPassword(passwordEncoder.encode(requestDTO.getNewPassword()));
		userRepository.save(user);

		otpRecord.setUsed(true);
		otpRepository.save(otpRecord);
	}

	// 🔐 Secure OTP Generator
	private String generateOtp() {
		Random random = new Random();
		int otp = 100000 + random.nextInt(900000);
		return String.valueOf(otp);
	}
}