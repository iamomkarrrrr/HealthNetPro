package com.healthnet.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthnet.entity.Audit;
import com.healthnet.enums.AuditStatus;
import com.healthnet.mapper.AuditMapper;
import com.healthnet.repository.AuditRepository;
import com.healthnet.responsedto.AuditResponseDTO;
import com.healthnet.resquestdto.CreateAuditRequestDTO;
import com.healthnet.resquestdto.UpdateAuditRequestDTO;
import com.healthnet.service.AuditService;

@Service
public class AuditServiceImpl implements AuditService {

	private final AuditRepository auditRepository;

	public AuditServiceImpl(AuditRepository auditRepository) {
		this.auditRepository = auditRepository;
	}

	@Override
	public AuditResponseDTO createAudit(CreateAuditRequestDTO requestDTO) {

		Audit audit = AuditMapper.toEntity(requestDTO);

		Audit savedAudit = auditRepository.save(audit);

		return AuditMapper.toResponseDTO(savedAudit);
	}

	@Override
	public List<AuditResponseDTO> getAuditsByOfficerId(Long officerId) {

		return auditRepository.findByOfficerId(officerId).stream().map(AuditMapper::toResponseDTO).toList();
	}

	@Override
	public List<AuditResponseDTO> getAuditsByStatus(AuditStatus status) {

		return auditRepository.findByStatus(status).stream().map(AuditMapper::toResponseDTO).toList();
	}

	@Override
	public AuditResponseDTO updateAudit(Long id, UpdateAuditRequestDTO requestDTO) {

		Audit existingAudit = auditRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Audit not found with id: " + id));

		existingAudit.setScope(requestDTO.getScope());
		existingAudit.setFindings(requestDTO.getFindings());
		existingAudit.setDate(requestDTO.getDate());
		existingAudit.setStatus(requestDTO.getStatus());

		Audit updatedAudit = auditRepository.save(existingAudit);

		return AuditMapper.toResponseDTO(updatedAudit);
	}
}
