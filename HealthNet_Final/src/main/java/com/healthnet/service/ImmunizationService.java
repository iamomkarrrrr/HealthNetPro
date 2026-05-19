package com.healthnet.service;

import java.util.List;

import com.healthnet.responsedto.ImmunizationResponseDTO;
import com.healthnet.resquestdto.CreateImmunizationRequestDTO;
import com.healthnet.resquestdto.UpdateImmunizationRequestDTO;

public interface ImmunizationService {

	ImmunizationResponseDTO createImmunization(CreateImmunizationRequestDTO requestDTO);

	List<ImmunizationResponseDTO> getImmunizationsByCitizenId(Long citizenId);

	ImmunizationResponseDTO updateImmunization(Long id, UpdateImmunizationRequestDTO requestDTO);
}
