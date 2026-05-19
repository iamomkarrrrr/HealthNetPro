package com.healthnet.service;

import java.util.List;

import com.healthnet.entity.AuditLog;
import com.healthnet.responsedto.AuditLogResponseDTO;

public interface AuditLogService {

	AuditLog saveAuditLog(AuditLog auditLog);

	List<AuditLogResponseDTO> getAllAuditLogs();

	AuditLogResponseDTO getAuditLogById(Long id);

	List<AuditLogResponseDTO> getAuditLogsByUserId(Long userId);
}