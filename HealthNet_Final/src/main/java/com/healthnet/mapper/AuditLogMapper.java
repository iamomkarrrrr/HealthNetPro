package com.healthnet.mapper;

import com.healthnet.entity.AuditLog;
import com.healthnet.responsedto.AuditLogResponseDTO;

public class AuditLogMapper {

	public static AuditLogResponseDTO toResponseDTO(AuditLog auditLog) {
		return AuditLogResponseDTO.builder().id(auditLog.getId()).userId(auditLog.getUserId())
				.action(auditLog.getAction()).resource(auditLog.getResource()).timestamp(auditLog.getTimestamp())
				.build();
	}
}