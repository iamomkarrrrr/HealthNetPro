package com.healthnet.service;

import java.time.LocalDate;
import java.util.List;

import com.healthnet.enums.ReportScope;
import com.healthnet.responsedto.ReportResponseDTO;
import com.healthnet.resquestdto.CreateReportRequestDTO;
import com.healthnet.resquestdto.UpdateReportRequestDTO;

public interface ReportService {

	ReportResponseDTO createReport(CreateReportRequestDTO requestDTO);

	List<ReportResponseDTO> getReportsByScope(ReportScope scope);

	List<ReportResponseDTO> getReportsByGeneratedDate(LocalDate generatedDate);

	ReportResponseDTO updateReport(Long id, UpdateReportRequestDTO requestDTO);
}