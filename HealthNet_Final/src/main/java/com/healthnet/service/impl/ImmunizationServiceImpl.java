package com.healthnet.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthnet.entity.Citizen;
import com.healthnet.entity.Immunization;
import com.healthnet.mapper.ImmunizationMapper;
import com.healthnet.repository.CitizenRepository;
import com.healthnet.repository.ImmunizationRepository;
import com.healthnet.responsedto.ImmunizationResponseDTO;
import com.healthnet.resquestdto.CreateImmunizationRequestDTO;
import com.healthnet.resquestdto.UpdateImmunizationRequestDTO;
import com.healthnet.service.ImmunizationService;

@Service
public class ImmunizationServiceImpl implements ImmunizationService {

	private final ImmunizationRepository immunizationRepository;
	private final CitizenRepository citizenRepository;

	public ImmunizationServiceImpl(ImmunizationRepository immunizationRepository, CitizenRepository citizenRepository) {
		this.immunizationRepository = immunizationRepository;
		this.citizenRepository = citizenRepository;
	}

	@Override
	public ImmunizationResponseDTO createImmunization(CreateImmunizationRequestDTO requestDTO) {

		Citizen citizen = citizenRepository.findById(requestDTO.getCitizenId())
				.orElseThrow(() -> new RuntimeException("Citizen not found with id: " + requestDTO.getCitizenId()));

		Immunization immunization = ImmunizationMapper.toEntity(requestDTO);

		Immunization savedImmunization = immunizationRepository.save(immunization);

		return ImmunizationMapper.toResponseDTO(savedImmunization);
	}

	@Override
	public List<ImmunizationResponseDTO> getImmunizationsByCitizenId(Long citizenId) {

		return immunizationRepository.findByCitizenId(citizenId).stream().map(ImmunizationMapper::toResponseDTO)
				.toList();
	}

	@Override
	public ImmunizationResponseDTO updateImmunization(Long id, UpdateImmunizationRequestDTO requestDTO) {

		Immunization existingImmunization = immunizationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Immunization not found with id: " + id));

		existingImmunization.setVaccineType(requestDTO.getVaccineType());
		existingImmunization.setDate(requestDTO.getDate());
		existingImmunization.setStatus(requestDTO.getStatus());

		Immunization updatedImmunization = immunizationRepository.save(existingImmunization);

		return ImmunizationMapper.toResponseDTO(updatedImmunization);
	}
}