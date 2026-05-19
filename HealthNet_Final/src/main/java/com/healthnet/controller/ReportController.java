package com.healthnet.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnet.api.APIResponse;
import com.healthnet.enums.ReportScope;
import com.healthnet.responsedto.ReportResponseDTO;
import com.healthnet.resquestdto.CreateReportRequestDTO;
import com.healthnet.resquestdto.UpdateReportRequestDTO;
import com.healthnet.service.ReportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

	private final ReportService reportService;

	public ReportController(ReportService reportService) {
		this.reportService = reportService;
	}

	@PreAuthorize("hasAnyRole('ADMIN','EPIDEMIOLOGIST','HEALTH_ADMINISTRATOR','COMPLIANCE_OFFICER')")
	@PostMapping
	public ResponseEntity<APIResponse<ReportResponseDTO>> createReport(
			@Valid @RequestBody CreateReportRequestDTO requestDTO) {

		ReportResponseDTO report = reportService.createReport(requestDTO);

		APIResponse<ReportResponseDTO> response = APIResponse.<ReportResponseDTO>builder().status("SUCCESS")
				.message("Report created successfully").data(report).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','EPIDEMIOLOGIST','HEALTH_ADMINISTRATOR','COMPLIANCE_OFFICER','AUDITOR')")
	@GetMapping("/scope/{scope}")
	public ResponseEntity<APIResponse<List<ReportResponseDTO>>> getReportsByScope(@PathVariable ReportScope scope) {

		List<ReportResponseDTO> reports = reportService.getReportsByScope(scope);

		APIResponse<List<ReportResponseDTO>> response = APIResponse.<List<ReportResponseDTO>>builder().status("SUCCESS")
				.message("Reports fetched successfully by scope").data(reports).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','EPIDEMIOLOGIST','HEALTH_ADMINISTRATOR','COMPLIANCE_OFFICER','AUDITOR')")
	@GetMapping("/date/{generatedDate}")
	public ResponseEntity<APIResponse<List<ReportResponseDTO>>> getReportsByGeneratedDate(
			@PathVariable LocalDate generatedDate) {

		List<ReportResponseDTO> reports = reportService.getReportsByGeneratedDate(generatedDate);

		APIResponse<List<ReportResponseDTO>> response = APIResponse.<List<ReportResponseDTO>>builder().status("SUCCESS")
				.message("Reports fetched successfully by generated date").data(reports).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','HEALTH_ADMINISTRATOR')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<ReportResponseDTO>> updateReport(@PathVariable Long id,
			@Valid @RequestBody UpdateReportRequestDTO requestDTO) {

		ReportResponseDTO report = reportService.updateReport(id, requestDTO);

		APIResponse<ReportResponseDTO> response = APIResponse.<ReportResponseDTO>builder().status("SUCCESS")
				.message("Report updated successfully").data(report).build();

		return ResponseEntity.ok(response);
	}
}