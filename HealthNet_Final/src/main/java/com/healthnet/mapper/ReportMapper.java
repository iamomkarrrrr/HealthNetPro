package com.healthnet.mapper;

import com.healthnet.entity.Report;
import com.healthnet.responsedto.ReportResponseDTO;
import com.healthnet.resquestdto.CreateReportRequestDTO;

public class ReportMapper {

	public static Report toEntity(CreateReportRequestDTO requestDTO) {
		return Report.builder().scope(requestDTO.getScope()).metrics(requestDTO.getMetrics())
				.generatedDate(requestDTO.getGeneratedDate()).build();
	}

	public static ReportResponseDTO toResponseDTO(Report report) {
		return ReportResponseDTO.builder().id(report.getId()).scope(report.getScope()).metrics(report.getMetrics())
				.generatedDate(report.getGeneratedDate()).build();
	}
}