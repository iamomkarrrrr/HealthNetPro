package com.healthnet.resquestdto;

import com.healthnet.enums.HealthProfileStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateHealthProfileRequestDTO {

	@NotBlank(message = "Medical history is required")
	private String medicalHistory;

	@NotBlank(message = "Allergies are required")
	private String allergies;

	@NotNull(message = "Status is required")
	private HealthProfileStatus status;
}