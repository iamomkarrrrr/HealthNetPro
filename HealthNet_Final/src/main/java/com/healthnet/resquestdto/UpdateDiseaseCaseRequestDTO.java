package com.healthnet.resquestdto;

import java.time.LocalDate;

import com.healthnet.enums.DiseaseCaseStatus;

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
public class UpdateDiseaseCaseRequestDTO {

	@NotBlank(message = "Disease type is required")
	private String diseaseType;

	@NotNull(message = "Diagnosis date is required")
	private LocalDate diagnosisDate;

	@NotNull(message = "Status is required")
	private DiseaseCaseStatus status;
}