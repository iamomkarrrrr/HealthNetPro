package com.healthnet.service;

import java.util.List;

import com.healthnet.enums.ComplianceEntityType;
import com.healthnet.responsedto.ComplianceRecordResponseDTO;
import com.healthnet.resquestdto.CreateComplianceRecordRequestDTO;
import com.healthnet.resquestdto.UpdateComplianceRecordRequestDTO;

public interface ComplianceRecordService {

	ComplianceRecordResponseDTO createComplianceRecord(CreateComplianceRecordRequestDTO requestDTO);

	List<ComplianceRecordResponseDTO> getComplianceRecordsByEntityId(Long entityId);

	List<ComplianceRecordResponseDTO> getComplianceRecordsByType(ComplianceEntityType type);

	ComplianceRecordResponseDTO updateComplianceRecord(Long id, UpdateComplianceRecordRequestDTO requestDTO);
}