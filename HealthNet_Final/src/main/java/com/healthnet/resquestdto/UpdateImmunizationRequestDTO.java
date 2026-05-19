package com.healthnet.resquestdto;

import java.time.LocalDate;

import com.healthnet.enums.ImmunizationStatus;

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
public class UpdateImmunizationRequestDTO {

	@NotBlank(message = "Vaccine type is required")
	private String vaccineType;

	@NotNull(message = "Date is required")
	private LocalDate date;

	@NotNull(message = "Status is required")
	private ImmunizationStatus status;
}