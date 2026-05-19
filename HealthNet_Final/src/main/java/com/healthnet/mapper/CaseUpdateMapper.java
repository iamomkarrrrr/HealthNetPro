package com.healthnet.mapper;

import com.healthnet.entity.CaseUpdate;
import com.healthnet.responsedto.CaseUpdateResponseDTO;
import com.healthnet.resquestdto.CreateCaseUpdateRequestDTO;

public class CaseUpdateMapper {

	public static CaseUpdate toEntity(CreateCaseUpdateRequestDTO requestDTO) {
		return CaseUpdate.builder().caseId(requestDTO.getCaseId()).doctorId(requestDTO.getDoctorId())
				.notes(requestDTO.getNotes()).date(requestDTO.getDate()).status(requestDTO.getStatus()).build();
	}

	public static CaseUpdateResponseDTO toResponseDTO(CaseUpdate caseUpdate) {
		return CaseUpdateResponseDTO.builder().id(caseUpdate.getId()).caseId(caseUpdate.getCaseId())
				.doctorId(caseUpdate.getDoctorId()).notes(caseUpdate.getNotes()).date(caseUpdate.getDate())
				.status(caseUpdate.getStatus()).build();
	}
}