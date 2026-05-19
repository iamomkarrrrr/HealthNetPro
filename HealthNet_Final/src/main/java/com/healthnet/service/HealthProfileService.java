package com.healthnet.service;

import com.healthnet.responsedto.HealthProfileResponseDTO;
import com.healthnet.resquestdto.CreateHealthProfileRequestDTO;
import com.healthnet.resquestdto.UpdateHealthProfileRequestDTO;

public interface HealthProfileService {

	HealthProfileResponseDTO createHealthProfile(CreateHealthProfileRequestDTO requestDTO);

	HealthProfileResponseDTO getHealthProfileById(Long id);

	HealthProfileResponseDTO getHealthProfileByCitizenId(Long citizenId);

	HealthProfileResponseDTO updateHealthProfile(Long id, UpdateHealthProfileRequestDTO requestDTO);
}
