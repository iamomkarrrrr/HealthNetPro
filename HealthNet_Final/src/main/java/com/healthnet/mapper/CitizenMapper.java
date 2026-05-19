package com.healthnet.mapper;

import com.healthnet.entity.Citizen;
import com.healthnet.responsedto.CitizenResponseDTO;
import com.healthnet.resquestdto.CreateCitizenRequestDTO;

public class CitizenMapper {

	public static Citizen toEntity(CreateCitizenRequestDTO requestDTO) {
		return Citizen.builder().name(requestDTO.getName()).dob(requestDTO.getDob()).gender(requestDTO.getGender())
				.address(requestDTO.getAddress()).contactInfo(requestDTO.getContactInfo()).build();
	}

	public static CitizenResponseDTO toResponseDTO(Citizen citizen) {
		return CitizenResponseDTO.builder().id(citizen.getId()).userId(citizen.getUserId()).name(citizen.getName())
				.dob(citizen.getDob()).gender(citizen.getGender()).address(citizen.getAddress())
				.contactInfo(citizen.getContactInfo()).status(citizen.getStatus()).build();
	}
}