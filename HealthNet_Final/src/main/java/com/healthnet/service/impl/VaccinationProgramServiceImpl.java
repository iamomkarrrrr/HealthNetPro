package com.healthnet.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthnet.entity.VaccinationProgram;
import com.healthnet.enums.VaccinationProgramStatus;
import com.healthnet.mapper.VaccinationProgramMapper;
import com.healthnet.repository.VaccinationProgramRepository;
import com.healthnet.responsedto.VaccinationProgramResponseDTO;
import com.healthnet.resquestdto.CreateVaccinationProgramRequestDTO;
import com.healthnet.resquestdto.UpdateVaccinationProgramRequestDTO;
import com.healthnet.service.NotificationService;
import com.healthnet.service.VaccinationProgramService;

@Service
public class VaccinationProgramServiceImpl implements VaccinationProgramService {

	private final VaccinationProgramRepository vaccinationProgramRepository;
	private final NotificationService notificationService;

	public VaccinationProgramServiceImpl(VaccinationProgramRepository vaccinationProgramRepository,
			NotificationService notificationService) {
		this.vaccinationProgramRepository = vaccinationProgramRepository;
		this.notificationService = notificationService;
	}

	@Override
	public VaccinationProgramResponseDTO createVaccinationProgram(CreateVaccinationProgramRequestDTO requestDTO) {

		validateProgramDates(requestDTO.getStatus(), requestDTO.getEndDate());

		VaccinationProgram vaccinationProgram = VaccinationProgramMapper.toEntity(requestDTO);

		VaccinationProgram savedProgram = vaccinationProgramRepository.save(vaccinationProgram);

		notificationService.sendVaccinationCampaignNotifications(savedProgram.getId(), savedProgram.getTitle(),
				savedProgram.getVaccineType(), savedProgram.getStartDate().toString());

		return VaccinationProgramMapper.toResponseDTO(savedProgram);
	}

	@Override
	public VaccinationProgramResponseDTO getVaccinationProgramById(Long id) {

		VaccinationProgram program = vaccinationProgramRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Vaccination program not found with id: " + id));

		return VaccinationProgramMapper.toResponseDTO(program);
	}

	@Override
	public List<VaccinationProgramResponseDTO> getAllVaccinationPrograms() {

		return vaccinationProgramRepository.findAll().stream().map(VaccinationProgramMapper::toResponseDTO).toList();
	}

	@Override
	public VaccinationProgramResponseDTO updateVaccinationProgram(Long id,
			UpdateVaccinationProgramRequestDTO requestDTO) {

		VaccinationProgram existingProgram = vaccinationProgramRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Vaccination program not found with id: " + id));

		validateProgramDates(requestDTO.getStatus(), requestDTO.getEndDate());

		existingProgram.setTitle(requestDTO.getTitle());
		existingProgram.setVaccineType(requestDTO.getVaccineType());
		existingProgram.setDescription(requestDTO.getDescription());
		existingProgram.setStartDate(requestDTO.getStartDate());
		existingProgram.setEndDate(requestDTO.getEndDate());
		existingProgram.setStatus(requestDTO.getStatus());

		VaccinationProgram updatedProgram = vaccinationProgramRepository.save(existingProgram);

		return VaccinationProgramMapper.toResponseDTO(updatedProgram);
	}

	private void validateProgramDates(VaccinationProgramStatus status, java.time.LocalDate endDate) {

		if (status == VaccinationProgramStatus.COMPLETED && endDate == null) {
			throw new RuntimeException("End date is required when vaccination program status is COMPLETED");
		}
	}
}