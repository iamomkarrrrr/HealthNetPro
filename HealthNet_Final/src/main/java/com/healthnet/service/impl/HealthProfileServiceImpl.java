package com.healthnet.service.impl;

import org.springframework.stereotype.Service;

import com.healthnet.entity.Citizen;
import com.healthnet.entity.HealthProfile;
import com.healthnet.mapper.HealthProfileMapper;
import com.healthnet.repository.CitizenRepository;
import com.healthnet.repository.HealthProfileRepository;
import com.healthnet.responsedto.HealthProfileResponseDTO;
import com.healthnet.resquestdto.CreateHealthProfileRequestDTO;
import com.healthnet.resquestdto.UpdateHealthProfileRequestDTO;
import com.healthnet.service.HealthProfileService;

@Service
public class HealthProfileServiceImpl implements HealthProfileService {

	private final HealthProfileRepository healthProfileRepository;
	private final CitizenRepository citizenRepository;

	public HealthProfileServiceImpl(HealthProfileRepository healthProfileRepository,
			CitizenRepository citizenRepository) {
		this.healthProfileRepository = healthProfileRepository;
		this.citizenRepository = citizenRepository;
	}

	@Override
	public HealthProfileResponseDTO createHealthProfile(CreateHealthProfileRequestDTO requestDTO) {

		Citizen citizen = citizenRepository.findById(requestDTO.getCitizenId())
				.orElseThrow(() -> new RuntimeException("Citizen not found with id: " + requestDTO.getCitizenId()));

		healthProfileRepository.findByCitizenId(citizen.getId()).ifPresent(existingProfile -> {
			throw new RuntimeException("Health profile already exists for citizen id: " + citizen.getId());
		});

		HealthProfile healthProfile = HealthProfileMapper.toEntity(requestDTO);

		HealthProfile savedHealthProfile = healthProfileRepository.save(healthProfile);

		return HealthProfileMapper.toResponseDTO(savedHealthProfile);
	}

	@Override
	public HealthProfileResponseDTO getHealthProfileById(Long id) {

		HealthProfile healthProfile = healthProfileRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Health profile not found with id: " + id));

		return HealthProfileMapper.toResponseDTO(healthProfile);
	}

	@Override
	public HealthProfileResponseDTO getHealthProfileByCitizenId(Long citizenId) {

		HealthProfile healthProfile = healthProfileRepository.findByCitizenId(citizenId)
				.orElseThrow(() -> new RuntimeException("Health profile not found for citizen id: " + citizenId));

		return HealthProfileMapper.toResponseDTO(healthProfile);
	}

	@Override
	public HealthProfileResponseDTO updateHealthProfile(Long id, UpdateHealthProfileRequestDTO requestDTO) {

		HealthProfile existingHealthProfile = healthProfileRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Health profile not found with id: " + id));

		existingHealthProfile.setMedicalHistory(requestDTO.getMedicalHistory());
		existingHealthProfile.setAllergies(requestDTO.getAllergies());
		existingHealthProfile.setStatus(requestDTO.getStatus());

		HealthProfile updatedHealthProfile = healthProfileRepository.save(existingHealthProfile);

		return HealthProfileMapper.toResponseDTO(updatedHealthProfile);
	}
}