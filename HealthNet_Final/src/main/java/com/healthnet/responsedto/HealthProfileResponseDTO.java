package com.healthnet.responsedto;

import com.healthnet.enums.HealthProfileStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HealthProfileResponseDTO {

	private Long id;

	private Long citizenId;

	private String medicalHistory;

	private String allergies;

	private HealthProfileStatus status;
}