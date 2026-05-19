package com.healthnet.responsedto;

import java.time.LocalDate;

import com.healthnet.enums.VaccinationProgramStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VaccinationProgramResponseDTO {

	private Long id;

	private String title;

	private String description;

	private LocalDate startDate;

	private LocalDate endDate;

	private VaccinationProgramStatus status;

	private String vaccineType;
}