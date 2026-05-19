package com.healthnet.mapper;

import com.healthnet.entity.Immunization;
import com.healthnet.responsedto.ImmunizationResponseDTO;
import com.healthnet.resquestdto.CreateImmunizationRequestDTO;

public class ImmunizationMapper {

	public static Immunization toEntity(CreateImmunizationRequestDTO requestDTO) {
		return Immunization.builder().citizenId(requestDTO.getCitizenId()).vaccineType(requestDTO.getVaccineType())
				.date(requestDTO.getDate()).status(requestDTO.getStatus()).build();
	}

	public static ImmunizationResponseDTO toResponseDTO(Immunization immunization) {
		return ImmunizationResponseDTO.builder().id(immunization.getId()).citizenId(immunization.getCitizenId())
				.vaccineType(immunization.getVaccineType()).date(immunization.getDate())
				.status(immunization.getStatus()).build();
	}
}
