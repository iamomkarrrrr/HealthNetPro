package com.healthnet.mapper;

import com.healthnet.entity.DiseaseCase;
import com.healthnet.responsedto.DiseaseCaseResponseDTO;
import com.healthnet.resquestdto.CreateDiseaseCaseRequestDTO;

public class DiseaseCaseMapper {

	public static DiseaseCase toEntity(CreateDiseaseCaseRequestDTO requestDTO) {
		return DiseaseCase.builder().citizenId(requestDTO.getCitizenId()).doctorId(requestDTO.getDoctorId())
				.diseaseType(requestDTO.getDiseaseType()).diagnosisDate(requestDTO.getDiagnosisDate())
				.status(requestDTO.getStatus()).build();
	}

	public static DiseaseCaseResponseDTO toResponseDTO(DiseaseCase diseaseCase) {
		return DiseaseCaseResponseDTO.builder().id(diseaseCase.getId()).citizenId(diseaseCase.getCitizenId())
				.doctorId(diseaseCase.getDoctorId()).diseaseType(diseaseCase.getDiseaseType())
				.diagnosisDate(diseaseCase.getDiagnosisDate()).status(diseaseCase.getStatus()).build();
	}
}