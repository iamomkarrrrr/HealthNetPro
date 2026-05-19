package com.healthnet.service;

import java.util.List;

import com.healthnet.responsedto.EpidemiologyDataResponseDTO;
import com.healthnet.resquestdto.CreateEpidemiologyDataRequestDTO;
import com.healthnet.resquestdto.UpdateEpidemiologyDataRequestDTO;

public interface EpidemiologyDataService {

	EpidemiologyDataResponseDTO createEpidemiologyData(CreateEpidemiologyDataRequestDTO requestDTO);

	List<EpidemiologyDataResponseDTO> getEpidemiologyDataByOutbreakId(Long outbreakId);

	EpidemiologyDataResponseDTO updateEpidemiologyData(Long id, UpdateEpidemiologyDataRequestDTO requestDTO);
}
