package com.healthnet.responsedto;

import java.time.LocalDate;

import com.healthnet.enums.ImmunizationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImmunizationResponseDTO {

	private Long id;

	private Long citizenId;

	private String vaccineType;

	private LocalDate date;

	private ImmunizationStatus status;
}