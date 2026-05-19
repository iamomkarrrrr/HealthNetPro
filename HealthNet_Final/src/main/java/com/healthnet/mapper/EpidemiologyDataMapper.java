package com.healthnet.mapper;

import com.healthnet.entity.EpidemiologyData;
import com.healthnet.responsedto.EpidemiologyDataResponseDTO;
import com.healthnet.resquestdto.CreateEpidemiologyDataRequestDTO;

public class EpidemiologyDataMapper {

	public static EpidemiologyData toEntity(CreateEpidemiologyDataRequestDTO requestDTO) {
		return EpidemiologyData.builder().outbreakId(requestDTO.getOutbreakId())
				.metricsJson(requestDTO.getMetricsJson()).date(requestDTO.getDate()).status(requestDTO.getStatus())
				.build();
	}

	public static EpidemiologyDataResponseDTO toResponseDTO(EpidemiologyData epidemiologyData) {
		return EpidemiologyDataResponseDTO.builder().id(epidemiologyData.getId())
				.outbreakId(epidemiologyData.getOutbreakId()).metricsJson(epidemiologyData.getMetricsJson())
				.date(epidemiologyData.getDate()).status(epidemiologyData.getStatus()).build();
	}
}