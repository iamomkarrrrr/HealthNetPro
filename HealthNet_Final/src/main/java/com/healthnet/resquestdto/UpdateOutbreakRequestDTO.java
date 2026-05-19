package com.healthnet.resquestdto;

import java.time.LocalDate;

import com.healthnet.enums.OutbreakStatus;

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
public class UpdateOutbreakRequestDTO {

	@NotBlank(message = "Disease type is required")
	private String diseaseType;

	@NotBlank(message = "Location is required")
	private String location;

	@NotNull(message = "Start date is required")
	private LocalDate startDate;

	private LocalDate endDate;

	@NotNull(message = "Status is required")
	private OutbreakStatus status;
}