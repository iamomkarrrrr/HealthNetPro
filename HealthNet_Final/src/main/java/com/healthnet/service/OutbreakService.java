package com.healthnet.service;

import java.util.List;

import com.healthnet.responsedto.OutbreakResponseDTO;
import com.healthnet.resquestdto.CreateOutbreakRequestDTO;
import com.healthnet.resquestdto.UpdateOutbreakRequestDTO;

public interface OutbreakService {

	OutbreakResponseDTO createOutbreak(CreateOutbreakRequestDTO requestDTO);

	OutbreakResponseDTO getOutbreakById(Long id);

	List<OutbreakResponseDTO> getAllOutbreaks();

	OutbreakResponseDTO updateOutbreak(Long id, UpdateOutbreakRequestDTO requestDTO);
}
