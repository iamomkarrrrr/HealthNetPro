package com.healthnet.mapper;

import com.healthnet.entity.ComplianceRecord;
import com.healthnet.responsedto.ComplianceRecordResponseDTO;
import com.healthnet.resquestdto.CreateComplianceRecordRequestDTO;

public class ComplianceRecordMapper {

	public static ComplianceRecord toEntity(CreateComplianceRecordRequestDTO requestDTO) {
		return ComplianceRecord.builder().entityId(requestDTO.getEntityId()).type(requestDTO.getType())
				.result(requestDTO.getResult()).date(requestDTO.getDate()).notes(requestDTO.getNotes()).build();
	}

	public static ComplianceRecordResponseDTO toResponseDTO(ComplianceRecord complianceRecord) {
		return ComplianceRecordResponseDTO.builder().id(complianceRecord.getId())
				.entityId(complianceRecord.getEntityId()).type(complianceRecord.getType())
				.result(complianceRecord.getResult()).date(complianceRecord.getDate())
				.notes(complianceRecord.getNotes()).build();
	}
}