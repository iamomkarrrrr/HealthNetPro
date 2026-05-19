package com.healthnet.service;

import java.util.List;

import com.healthnet.responsedto.VaccinationProgramResponseDTO;
import com.healthnet.resquestdto.CreateVaccinationProgramRequestDTO;
import com.healthnet.resquestdto.UpdateVaccinationProgramRequestDTO;

public interface VaccinationProgramService {

	VaccinationProgramResponseDTO createVaccinationProgram(CreateVaccinationProgramRequestDTO requestDTO);

	VaccinationProgramResponseDTO getVaccinationProgramById(Long id);

	List<VaccinationProgramResponseDTO> getAllVaccinationPrograms();

	VaccinationProgramResponseDTO updateVaccinationProgram(Long id, UpdateVaccinationProgramRequestDTO requestDTO);
}