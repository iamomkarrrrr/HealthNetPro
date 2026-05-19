package com.healthnet.mapper;

import com.healthnet.entity.HealthProfile;
import com.healthnet.responsedto.HealthProfileResponseDTO;
import com.healthnet.resquestdto.CreateHealthProfileRequestDTO;

public class HealthProfileMapper {

	public static HealthProfile toEntity(CreateHealthProfileRequestDTO requestDTO) {
		return HealthProfile.builder().citizenId(requestDTO.getCitizenId())
				.medicalHistory(requestDTO.getMedicalHistory()).allergies(requestDTO.getAllergies())
				.status(requestDTO.getStatus()).build();
	}

	public static HealthProfileResponseDTO toResponseDTO(HealthProfile healthProfile) {
		return HealthProfileResponseDTO.builder().id(healthProfile.getId()).citizenId(healthProfile.getCitizenId())
				.medicalHistory(healthProfile.getMedicalHistory()).allergies(healthProfile.getAllergies())
				.status(healthProfile.getStatus()).build();
	}
}