package com.healthnet.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthnet.entity.ComplianceRecord;
import com.healthnet.enums.ComplianceEntityType;
import com.healthnet.mapper.ComplianceRecordMapper;
import com.healthnet.repository.ComplianceRecordRepository;
import com.healthnet.responsedto.ComplianceRecordResponseDTO;
import com.healthnet.resquestdto.CreateComplianceRecordRequestDTO;
import com.healthnet.resquestdto.UpdateComplianceRecordRequestDTO;
import com.healthnet.service.ComplianceRecordService;

@Service
public class ComplianceRecordServiceImpl implements ComplianceRecordService {

	private final ComplianceRecordRepository complianceRecordRepository;

	public ComplianceRecordServiceImpl(ComplianceRecordRepository complianceRecordRepository) {
		this.complianceRecordRepository = complianceRecordRepository;
	}

	@Override
	public ComplianceRecordResponseDTO createComplianceRecord(CreateComplianceRecordRequestDTO requestDTO) {

		ComplianceRecord record = ComplianceRecordMapper.toEntity(requestDTO);

		ComplianceRecord savedRecord = complianceRecordRepository.save(record);

		return ComplianceRecordMapper.toResponseDTO(savedRecord);
	}

	@Override
	public List<ComplianceRecordResponseDTO> getComplianceRecordsByEntityId(Long entityId) {

		return complianceRecordRepository.findByEntityId(entityId).stream().map(ComplianceRecordMapper::toResponseDTO)
				.toList();
	}

	@Override
	public List<ComplianceRecordResponseDTO> getComplianceRecordsByType(ComplianceEntityType type) {

		return complianceRecordRepository.findByType(type).stream().map(ComplianceRecordMapper::toResponseDTO).toList();
	}

	@Override
	public ComplianceRecordResponseDTO updateComplianceRecord(Long id, UpdateComplianceRecordRequestDTO requestDTO) {

		ComplianceRecord existingRecord = complianceRecordRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Compliance record not found with id: " + id));

		existingRecord.setEntityId(requestDTO.getEntityId());
		existingRecord.setType(requestDTO.getType());
		existingRecord.setResult(requestDTO.getResult());
		existingRecord.setDate(requestDTO.getDate());
		existingRecord.setNotes(requestDTO.getNotes());

		ComplianceRecord updatedRecord = complianceRecordRepository.save(existingRecord);

		return ComplianceRecordMapper.toResponseDTO(updatedRecord);
	}
}