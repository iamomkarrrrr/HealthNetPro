package com.healthnet.responsedto;

import java.time.LocalDate;

import com.healthnet.enums.DiseaseCaseStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiseaseCaseResponseDTO {

	private Long id;

	private Long citizenId;

	private Long doctorId;

	private String diseaseType;

	private LocalDate diagnosisDate;

	private DiseaseCaseStatus status;
}