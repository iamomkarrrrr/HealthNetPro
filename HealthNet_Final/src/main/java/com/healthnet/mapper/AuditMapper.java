package com.healthnet.mapper;

import com.healthnet.entity.Audit;
import com.healthnet.responsedto.AuditResponseDTO;
import com.healthnet.resquestdto.CreateAuditRequestDTO;

public class AuditMapper {

	public static Audit toEntity(CreateAuditRequestDTO requestDTO) {
		return Audit.builder().officerId(requestDTO.getOfficerId()).scope(requestDTO.getScope())
				.findings(requestDTO.getFindings()).date(requestDTO.getDate()).status(requestDTO.getStatus()).build();
	}

	public static AuditResponseDTO toResponseDTO(Audit audit) {
		return AuditResponseDTO.builder().id(audit.getId()).officerId(audit.getOfficerId()).scope(audit.getScope())
				.findings(audit.getFindings()).date(audit.getDate()).status(audit.getStatus()).build();
	}
}