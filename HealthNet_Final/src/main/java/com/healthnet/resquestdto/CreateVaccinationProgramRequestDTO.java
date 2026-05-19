package com.healthnet.resquestdto;

import java.time.LocalDate;

import com.healthnet.enums.VaccinationProgramStatus;

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
public class CreateVaccinationProgramRequestDTO {

	@NotBlank(message = "Title is required")
	private String title;

	@NotBlank(message = "Description is required")
	private String description;

	@NotNull(message = "Start date is required")
	private LocalDate startDate;

	private LocalDate endDate;

	@NotNull(message = "Status is required")
	private VaccinationProgramStatus status;

	@NotBlank(message = "Vaccine type is required")
	private String vaccineType;
}