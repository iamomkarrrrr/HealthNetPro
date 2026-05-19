package com.healthnet.resquestdto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VerifyOtpRequestDTO {

	@NotBlank(message = "Email is required")
	private String email;

	@NotBlank(message = "OTP is required")
	@Size(min = 6, max = 6, message = "OTP must be 6 digits")
	private String otp;
}