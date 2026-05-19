package com.healthnet.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthnet.entity.Citizen;
import com.healthnet.entity.DiseaseCase;
import com.healthnet.entity.User;
import com.healthnet.mapper.DiseaseCaseMapper;
import com.healthnet.repository.CitizenRepository;
import com.healthnet.repository.DiseaseCaseRepository;
import com.healthnet.repository.UserRepository;
import com.healthnet.responsedto.DiseaseCaseResponseDTO;
import com.healthnet.resquestdto.CreateDiseaseCaseRequestDTO;
import com.healthnet.resquestdto.UpdateDiseaseCaseRequestDTO;
import com.healthnet.service.DiseaseCaseService;

@Service
public class DiseaseCaseServiceImpl implements DiseaseCaseService {

	private final DiseaseCaseRepository diseaseCaseRepository;
	private final CitizenRepository citizenRepository;
	private final UserRepository userRepository;

	public DiseaseCaseServiceImpl(DiseaseCaseRepository diseaseCaseRepository, CitizenRepository citizenRepository,
			UserRepository userRepository) {
		this.diseaseCaseRepository = diseaseCaseRepository;
		this.citizenRepository = citizenRepository;
		this.userRepository = userRepository;
	}

	@Override
	public DiseaseCaseResponseDTO createDiseaseCase(CreateDiseaseCaseRequestDTO requestDTO) {

		Citizen citizen = citizenRepository.findById(requestDTO.getCitizenId())
				.orElseThrow(() -> new RuntimeException("Citizen not found with id: " + requestDTO.getCitizenId()));

		User doctor = userRepository.findById(requestDTO.getDoctorId())
				.orElseThrow(() -> new RuntimeException("Doctor not found with id: " + requestDTO.getDoctorId()));

		DiseaseCase diseaseCase = DiseaseCaseMapper.toEntity(requestDTO);

		DiseaseCase savedDiseaseCase = diseaseCaseRepository.save(diseaseCase);

		return DiseaseCaseMapper.toResponseDTO(savedDiseaseCase);
	}

	@Override
	public DiseaseCaseResponseDTO getDiseaseCaseById(Long id) {

		DiseaseCase diseaseCase = diseaseCaseRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Disease case not found with id: " + id));

		return DiseaseCaseMapper.toResponseDTO(diseaseCase);
	}

	@Override
	public List<DiseaseCaseResponseDTO> getAllDiseaseCases() {

		return diseaseCaseRepository.findAll().stream().map(DiseaseCaseMapper::toResponseDTO).toList();
	}

	@Override
	public DiseaseCaseResponseDTO updateDiseaseCase(Long id, UpdateDiseaseCaseRequestDTO requestDTO) {

		DiseaseCase existingCase = diseaseCaseRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Disease case not found with id: " + id));

		existingCase.setDiseaseType(requestDTO.getDiseaseType());
		existingCase.setDiagnosisDate(requestDTO.getDiagnosisDate());
		existingCase.setStatus(requestDTO.getStatus());

		DiseaseCase updatedCase = diseaseCaseRepository.save(existingCase);

		return DiseaseCaseMapper.toResponseDTO(updatedCase);
	}
}