package com.healthnet.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthnet.entity.Citizen;
import com.healthnet.enums.CitizenStatus;
import com.healthnet.mapper.CitizenMapper;
import com.healthnet.repository.CitizenRepository;
import com.healthnet.repository.UserRepository;
import com.healthnet.responsedto.CitizenResponseDTO;
import com.healthnet.resquestdto.CreateCitizenRequestDTO;
import com.healthnet.resquestdto.UpdateCitizenRequestDTO;
import com.healthnet.resquestdto.UpdateCitizenStatusRequestDTO;
import com.healthnet.service.CitizenService;

@Service
public class CitizenServiceImpl implements CitizenService {

	private final CitizenRepository citizenRepository;
	private final UserRepository userRepository;

	public CitizenServiceImpl(CitizenRepository citizenRepository, UserRepository userRepository) {
		this.citizenRepository = citizenRepository;
		this.userRepository = userRepository;
	}

	@Override
	public CitizenResponseDTO createCitizen(Long userId, CreateCitizenRequestDTO requestDTO) {

		userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

		if (citizenRepository.existsByUserId(userId)) {
			throw new RuntimeException("Citizen profile already exists for this user");
		}

		if (citizenRepository.existsByContactInfo(requestDTO.getContactInfo())) {
			throw new RuntimeException("Citizen already exists with contact info: " + requestDTO.getContactInfo());
		}

		Citizen citizen = CitizenMapper.toEntity(requestDTO);
		citizen.setUserId(userId);
		citizen.setStatus(CitizenStatus.ACTIVE);

		Citizen savedCitizen = citizenRepository.save(citizen);

		return CitizenMapper.toResponseDTO(savedCitizen);
	}

	@Override
	public CitizenResponseDTO getCitizenById(Long id) {

		Citizen citizen = citizenRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Citizen not found with id: " + id));

		return CitizenMapper.toResponseDTO(citizen);
	}

	@Override
	public CitizenResponseDTO getCitizenByUserId(Long userId) {

		Citizen citizen = citizenRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Citizen profile not completed for this user"));

		return CitizenMapper.toResponseDTO(citizen);
	}

	@Override
	public boolean existsByUserId(Long userId) {
		return citizenRepository.existsByUserId(userId);
	}

	@Override
	public List<CitizenResponseDTO> getAllCitizens() {
		return citizenRepository.findAll().stream().map(CitizenMapper::toResponseDTO).toList();
	}

	@Override
	public CitizenResponseDTO updateCitizen(Long id, UpdateCitizenRequestDTO requestDTO) {

		Citizen existingCitizen = citizenRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Citizen not found with id: " + id));

		existingCitizen.setName(requestDTO.getName());
		existingCitizen.setDob(requestDTO.getDob());
		existingCitizen.setGender(requestDTO.getGender());
		existingCitizen.setAddress(requestDTO.getAddress());
		existingCitizen.setContactInfo(requestDTO.getContactInfo());

		Citizen updatedCitizen = citizenRepository.save(existingCitizen);

		return CitizenMapper.toResponseDTO(updatedCitizen);
	}

	@Override
	public CitizenResponseDTO updateCitizenByUserId(Long userId, UpdateCitizenRequestDTO requestDTO) {

		Citizen existingCitizen = citizenRepository.findByUserId(userId)
				.orElseThrow(() -> new RuntimeException("Citizen profile not completed for this user"));

		existingCitizen.setName(requestDTO.getName());
		existingCitizen.setDob(requestDTO.getDob());
		existingCitizen.setGender(requestDTO.getGender());
		existingCitizen.setAddress(requestDTO.getAddress());
		existingCitizen.setContactInfo(requestDTO.getContactInfo());

		Citizen updatedCitizen = citizenRepository.save(existingCitizen);

		return CitizenMapper.toResponseDTO(updatedCitizen);
	}

	@Override
	public CitizenResponseDTO updateCitizenStatus(Long id, UpdateCitizenStatusRequestDTO requestDTO) {

		Citizen existingCitizen = citizenRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Citizen not found with id: " + id));

		existingCitizen.setStatus(requestDTO.getStatus());

		Citizen updatedCitizen = citizenRepository.save(existingCitizen);

		return CitizenMapper.toResponseDTO(updatedCitizen);
	}
}