package com.healthnet.service;

import java.util.List;

import com.healthnet.responsedto.DiseaseCaseResponseDTO;
import com.healthnet.resquestdto.CreateDiseaseCaseRequestDTO;
import com.healthnet.resquestdto.UpdateDiseaseCaseRequestDTO;

public interface DiseaseCaseService {

	DiseaseCaseResponseDTO createDiseaseCase(CreateDiseaseCaseRequestDTO requestDTO);

	DiseaseCaseResponseDTO getDiseaseCaseById(Long id);

	List<DiseaseCaseResponseDTO> getAllDiseaseCases();

	DiseaseCaseResponseDTO updateDiseaseCase(Long id, UpdateDiseaseCaseRequestDTO requestDTO);
}