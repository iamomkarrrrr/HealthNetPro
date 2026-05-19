package com.healthnet.service;

import java.util.List;

import com.healthnet.enums.AuditStatus;
import com.healthnet.responsedto.AuditResponseDTO;
import com.healthnet.resquestdto.CreateAuditRequestDTO;
import com.healthnet.resquestdto.UpdateAuditRequestDTO;

public interface AuditService {

	AuditResponseDTO createAudit(CreateAuditRequestDTO requestDTO);

	List<AuditResponseDTO> getAuditsByOfficerId(Long officerId);

	List<AuditResponseDTO> getAuditsByStatus(AuditStatus status);

	AuditResponseDTO updateAudit(Long id, UpdateAuditRequestDTO requestDTO);
}