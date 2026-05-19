package com.healthnet.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthnet.entity.EpidemiologyData;
import com.healthnet.entity.Outbreak;
import com.healthnet.mapper.EpidemiologyDataMapper;
import com.healthnet.repository.EpidemiologyDataRepository;
import com.healthnet.repository.OutbreakRepository;
import com.healthnet.responsedto.EpidemiologyDataResponseDTO;
import com.healthnet.resquestdto.CreateEpidemiologyDataRequestDTO;
import com.healthnet.resquestdto.UpdateEpidemiologyDataRequestDTO;
import com.healthnet.service.EpidemiologyDataService;

@Service
public class EpidemiologyDataServiceImpl implements EpidemiologyDataService {

	private final EpidemiologyDataRepository epidemiologyDataRepository;
	private final OutbreakRepository outbreakRepository;

	public EpidemiologyDataServiceImpl(EpidemiologyDataRepository epidemiologyDataRepository,
			OutbreakRepository outbreakRepository) {
		this.epidemiologyDataRepository = epidemiologyDataRepository;
		this.outbreakRepository = outbreakRepository;
	}

	@Override
	public EpidemiologyDataResponseDTO createEpidemiologyData(CreateEpidemiologyDataRequestDTO requestDTO) {

		Outbreak outbreak = outbreakRepository.findById(requestDTO.getOutbreakId())
				.orElseThrow(() -> new RuntimeException("Outbreak not found with id: " + requestDTO.getOutbreakId()));

		EpidemiologyData epidemiologyData = EpidemiologyDataMapper.toEntity(requestDTO);

		EpidemiologyData savedData = epidemiologyDataRepository.save(epidemiologyData);

		return EpidemiologyDataMapper.toResponseDTO(savedData);
	}

	@Override
	public List<EpidemiologyDataResponseDTO> getEpidemiologyDataByOutbreakId(Long outbreakId) {

		return epidemiologyDataRepository.findByOutbreakId(outbreakId).stream()
				.map(EpidemiologyDataMapper::toResponseDTO).toList();
	}

	@Override
	public EpidemiologyDataResponseDTO updateEpidemiologyData(Long id, UpdateEpidemiologyDataRequestDTO requestDTO) {

		EpidemiologyData existingData = epidemiologyDataRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Epidemiology data not found with id: " + id));

		existingData.setMetricsJson(requestDTO.getMetricsJson());
		existingData.setDate(requestDTO.getDate());
		existingData.setStatus(requestDTO.getStatus());

		EpidemiologyData updatedData = epidemiologyDataRepository.save(existingData);

		return EpidemiologyDataMapper.toResponseDTO(updatedData);
	}
}