package com.healthnet.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.healthnet.entity.Report;
import com.healthnet.enums.ReportScope;
import com.healthnet.mapper.ReportMapper;
import com.healthnet.repository.ReportRepository;
import com.healthnet.responsedto.ReportResponseDTO;
import com.healthnet.resquestdto.CreateReportRequestDTO;
import com.healthnet.resquestdto.UpdateReportRequestDTO;
import com.healthnet.service.ReportService;

@Service
public class ReportServiceImpl implements ReportService {

	private final ReportRepository reportRepository;

	public ReportServiceImpl(ReportRepository reportRepository) {
		this.reportRepository = reportRepository;
	}

	@Override
	public ReportResponseDTO createReport(CreateReportRequestDTO requestDTO) {

		Report report = ReportMapper.toEntity(requestDTO);
		Report savedReport = reportRepository.save(report);

		return ReportMapper.toResponseDTO(savedReport);
	}

	@Override
	public List<ReportResponseDTO> getReportsByScope(ReportScope scope) {

		return reportRepository.findByScope(scope).stream().map(ReportMapper::toResponseDTO)
				.collect(Collectors.toList());
	}

	@Override
	public List<ReportResponseDTO> getReportsByGeneratedDate(LocalDate generatedDate) {

		return reportRepository.findByGeneratedDate(generatedDate).stream().map(ReportMapper::toResponseDTO)
				.collect(Collectors.toList());
	}

	@Override
	public ReportResponseDTO updateReport(Long id, UpdateReportRequestDTO requestDTO) {

		Report existingReport = reportRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Report not found with id: " + id));

		existingReport.setScope(requestDTO.getScope());
		existingReport.setMetrics(requestDTO.getMetrics());
		existingReport.setGeneratedDate(requestDTO.getGeneratedDate());

		Report updatedReport = reportRepository.save(existingReport);

		return ReportMapper.toResponseDTO(updatedReport);
	}
}