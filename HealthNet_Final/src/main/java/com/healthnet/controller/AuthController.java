package com.healthnet.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnet.api.APIResponse;
import com.healthnet.responsedto.LoginResponseDTO;
import com.healthnet.resquestdto.ChangePasswordRequestDTO;
import com.healthnet.resquestdto.ForgotPasswordRequestDTO;
import com.healthnet.resquestdto.LoginRequestDTO;
import com.healthnet.resquestdto.ResetPasswordRequestDTO;
import com.healthnet.resquestdto.VerifyOtpRequestDTO;
import com.healthnet.service.AuthService;
import com.healthnet.service.PasswordResetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

	private final AuthService authService;
	private final PasswordResetService passwordResetService;

	public AuthController(AuthService authService, PasswordResetService passwordResetService) {
		this.authService = authService;
		this.passwordResetService = passwordResetService;
	}

	@PostMapping("/reset-password")
	public ResponseEntity<APIResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO requestDTO) {

		passwordResetService.resetPassword(requestDTO);

		APIResponse<Void> response = APIResponse.<Void>builder().status("SUCCESS")
				.message("Password reset successfully").data(null).build();

		return ResponseEntity.ok(response);
	}

	@PostMapping("/change-password")
	public ResponseEntity<APIResponse<Object>> changePassword(@Valid @RequestBody ChangePasswordRequestDTO requestDTO) {

		authService.changePassword(requestDTO);

		APIResponse<Object> response = APIResponse.builder().status("SUCCESS").message("Password changed successfully")
				.data(null).build();

		return ResponseEntity.ok(response);
	}

	@PostMapping("/login")
	public ResponseEntity<APIResponse<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO requestDTO) {

		LoginResponseDTO loginResponse = authService.login(requestDTO);

		APIResponse<LoginResponseDTO> response = APIResponse.<LoginResponseDTO>builder().status("SUCCESS")
				.message("Login successful").data(loginResponse).build();

		return ResponseEntity.ok(response);
	}

	@PostMapping("/verify-reset-otp")
	public ResponseEntity<APIResponse<Void>> verifyOtp(@Valid @RequestBody VerifyOtpRequestDTO requestDTO) {

		passwordResetService.verifyOtp(requestDTO);

		APIResponse<Void> response = APIResponse.<Void>builder().status("SUCCESS").message("OTP verified successfully")
				.data(null).build();

		return ResponseEntity.ok(response);
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<APIResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO requestDTO) {

		passwordResetService.requestOtp(requestDTO);

		APIResponse<Void> response = APIResponse.<Void>builder().status("SUCCESS")
				.message("If the email is registered, an OTP has been sent").data(null).build();

		return ResponseEntity.ok(response);
	}

}