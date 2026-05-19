package com.healthnet.service;

import java.util.List;

import com.healthnet.responsedto.CitizenResponseDTO;
import com.healthnet.resquestdto.CreateCitizenRequestDTO;
import com.healthnet.resquestdto.UpdateCitizenRequestDTO;
import com.healthnet.resquestdto.UpdateCitizenStatusRequestDTO;

public interface CitizenService {

	CitizenResponseDTO createCitizen(Long userId, CreateCitizenRequestDTO requestDTO);

	CitizenResponseDTO getCitizenById(Long id);

	CitizenResponseDTO getCitizenByUserId(Long userId);

	boolean existsByUserId(Long userId);

	List<CitizenResponseDTO> getAllCitizens();

	CitizenResponseDTO updateCitizen(Long id, UpdateCitizenRequestDTO requestDTO);

	CitizenResponseDTO updateCitizenByUserId(Long userId, UpdateCitizenRequestDTO requestDTO);

	CitizenResponseDTO updateCitizenStatus(Long id, UpdateCitizenStatusRequestDTO requestDTO);
}