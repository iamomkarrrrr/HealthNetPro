package com.healthnet.mapper;

import com.healthnet.entity.Outbreak;
import com.healthnet.responsedto.OutbreakResponseDTO;
import com.healthnet.resquestdto.CreateOutbreakRequestDTO;

public class OutbreakMapper {

	public static Outbreak toEntity(CreateOutbreakRequestDTO requestDTO) {
		return Outbreak.builder().diseaseType(requestDTO.getDiseaseType()).location(requestDTO.getLocation())
				.startDate(requestDTO.getStartDate()).endDate(requestDTO.getEndDate()).status(requestDTO.getStatus())
				.build();
	}

	public static OutbreakResponseDTO toResponseDTO(Outbreak outbreak) {
		return OutbreakResponseDTO.builder().id(outbreak.getId()).diseaseType(outbreak.getDiseaseType())
				.location(outbreak.getLocation()).startDate(outbreak.getStartDate()).endDate(outbreak.getEndDate())
				.status(outbreak.getStatus()).build();
	}
}