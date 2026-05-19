package com.healthnet.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthnet.entity.AuditLog;
import com.healthnet.mapper.AuditLogMapper;
import com.healthnet.repository.AuditLogRepository;
import com.healthnet.responsedto.AuditLogResponseDTO;
import com.healthnet.service.AuditLogService;

@Service
public class AuditLogServiceImpl implements AuditLogService {

	private final AuditLogRepository auditLogRepository;

	public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
		this.auditLogRepository = auditLogRepository;
	}

	@Override
	public AuditLog saveAuditLog(AuditLog auditLog) {
		return auditLogRepository.save(auditLog);
	}

	@Override
	public List<AuditLogResponseDTO> getAllAuditLogs() {
		return auditLogRepository.findAll().stream().map(AuditLogMapper::toResponseDTO).toList();
	}

	@Override
	public AuditLogResponseDTO getAuditLogById(Long id) {
		AuditLog auditLog = auditLogRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Audit log not found with id: " + id));

		return AuditLogMapper.toResponseDTO(auditLog);
	}

	@Override
	public List<AuditLogResponseDTO> getAuditLogsByUserId(Long userId) {
		return auditLogRepository.findByUserId(userId).stream().map(AuditLogMapper::toResponseDTO).toList();
	}
}