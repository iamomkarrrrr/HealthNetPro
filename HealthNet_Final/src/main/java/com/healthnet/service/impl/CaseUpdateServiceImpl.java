package com.healthnet.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthnet.entity.CaseUpdate;
import com.healthnet.entity.DiseaseCase;
import com.healthnet.entity.User;
import com.healthnet.mapper.CaseUpdateMapper;
import com.healthnet.repository.CaseUpdateRepository;
import com.healthnet.repository.DiseaseCaseRepository;
import com.healthnet.repository.UserRepository;
import com.healthnet.responsedto.CaseUpdateResponseDTO;
import com.healthnet.resquestdto.CreateCaseUpdateRequestDTO;
import com.healthnet.resquestdto.UpdateCaseUpdateRequestDTO;
import com.healthnet.service.CaseUpdateService;

@Service
public class CaseUpdateServiceImpl implements CaseUpdateService {

	private final CaseUpdateRepository caseUpdateRepository;
	private final DiseaseCaseRepository diseaseCaseRepository;
	private final UserRepository userRepository;

	public CaseUpdateServiceImpl(CaseUpdateRepository caseUpdateRepository, DiseaseCaseRepository diseaseCaseRepository,
			UserRepository userRepository) {
		this.caseUpdateRepository = caseUpdateRepository;
		this.diseaseCaseRepository = diseaseCaseRepository;
		this.userRepository = userRepository;
	}

	@Override
	public CaseUpdateResponseDTO createCaseUpdate(CreateCaseUpdateRequestDTO requestDTO) {

		DiseaseCase diseaseCase = diseaseCaseRepository.findById(requestDTO.getCaseId())
				.orElseThrow(() -> new RuntimeException("Disease case not found with id: " + requestDTO.getCaseId()));

		User doctor = userRepository.findById(requestDTO.getDoctorId())
				.orElseThrow(() -> new RuntimeException("Doctor not found with id: " + requestDTO.getDoctorId()));

		CaseUpdate caseUpdate = CaseUpdateMapper.toEntity(requestDTO);

		CaseUpdate savedCaseUpdate = caseUpdateRepository.save(caseUpdate);

		return CaseUpdateMapper.toResponseDTO(savedCaseUpdate);
	}

	@Override
	public List<CaseUpdateResponseDTO> getCaseUpdatesByCaseId(Long caseId) {

		return caseUpdateRepository.findByCaseId(caseId).stream().map(CaseUpdateMapper::toResponseDTO).toList();
	}

	@Override
	public CaseUpdateResponseDTO updateCaseUpdate(Long id, UpdateCaseUpdateRequestDTO requestDTO) {

		CaseUpdate existingCaseUpdate = caseUpdateRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Case update not found with id: " + id));

		existingCaseUpdate.setNotes(requestDTO.getNotes());
		existingCaseUpdate.setDate(requestDTO.getDate());
		existingCaseUpdate.setStatus(requestDTO.getStatus());

		CaseUpdate updatedCaseUpdate = caseUpdateRepository.save(existingCaseUpdate);

		return CaseUpdateMapper.toResponseDTO(updatedCaseUpdate);
	}
}
