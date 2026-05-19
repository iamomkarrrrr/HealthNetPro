package com.healthnet.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthnet.entity.Outbreak;
import com.healthnet.enums.OutbreakStatus;
import com.healthnet.mapper.OutbreakMapper;
import com.healthnet.repository.OutbreakRepository;
import com.healthnet.responsedto.OutbreakResponseDTO;
import com.healthnet.resquestdto.CreateOutbreakRequestDTO;
import com.healthnet.resquestdto.UpdateOutbreakRequestDTO;
import com.healthnet.service.OutbreakService;

@Service
public class OutbreakServiceImpl implements OutbreakService {

	private final OutbreakRepository outbreakRepository;

	public OutbreakServiceImpl(OutbreakRepository outbreakRepository) {
		this.outbreakRepository = outbreakRepository;
	}

	@Override
	public OutbreakResponseDTO createOutbreak(CreateOutbreakRequestDTO requestDTO) {

		validateOutbreakDates(requestDTO.getStatus(), requestDTO.getEndDate());

		Outbreak outbreak = OutbreakMapper.toEntity(requestDTO);

		Outbreak savedOutbreak = outbreakRepository.save(outbreak);

		return OutbreakMapper.toResponseDTO(savedOutbreak);
	}

	@Override
	public OutbreakResponseDTO getOutbreakById(Long id) {

		Outbreak outbreak = outbreakRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Outbreak not found with id: " + id));

		return OutbreakMapper.toResponseDTO(outbreak);
	}

	@Override
	public List<OutbreakResponseDTO> getAllOutbreaks() {

		return outbreakRepository.findAll().stream().map(OutbreakMapper::toResponseDTO).toList();
	}

	@Override
	public OutbreakResponseDTO updateOutbreak(Long id, UpdateOutbreakRequestDTO requestDTO) {

		Outbreak existingOutbreak = outbreakRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Outbreak not found with id: " + id));

		validateOutbreakDates(requestDTO.getStatus(), requestDTO.getEndDate());

		existingOutbreak.setDiseaseType(requestDTO.getDiseaseType());
		existingOutbreak.setLocation(requestDTO.getLocation());
		existingOutbreak.setStartDate(requestDTO.getStartDate());
		existingOutbreak.setEndDate(requestDTO.getEndDate());
		existingOutbreak.setStatus(requestDTO.getStatus());

		Outbreak updatedOutbreak = outbreakRepository.save(existingOutbreak);

		return OutbreakMapper.toResponseDTO(updatedOutbreak);
	}

	private void validateOutbreakDates(OutbreakStatus status, java.time.LocalDate endDate) {
		if ((status == OutbreakStatus.CONTAINED || status == OutbreakStatus.CLOSED) && endDate == null) {
			throw new RuntimeException("End date is required when outbreak status is CONTAINED or CLOSED");
		}
	}
}