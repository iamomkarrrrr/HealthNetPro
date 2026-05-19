package com.healthnet.controller;

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
import com.healthnet.enums.ComplianceEntityType;
import com.healthnet.responsedto.ComplianceRecordResponseDTO;
import com.healthnet.resquestdto.CreateComplianceRecordRequestDTO;
import com.healthnet.resquestdto.UpdateComplianceRecordRequestDTO;
import com.healthnet.service.ComplianceRecordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/compliance-records")
public class ComplianceRecordController {

	private final ComplianceRecordService complianceRecordService;

	public ComplianceRecordController(ComplianceRecordService complianceRecordService) {
		this.complianceRecordService = complianceRecordService;
	}

	@PreAuthorize("hasAnyRole('COMPLIANCE_OFFICER','ADMIN','HEALTH_ADMINISTRATOR')")
	@PostMapping
	public ResponseEntity<APIResponse<ComplianceRecordResponseDTO>> createComplianceRecord(
			@Valid @RequestBody CreateComplianceRecordRequestDTO requestDTO) {

		ComplianceRecordResponseDTO record = complianceRecordService.createComplianceRecord(requestDTO);

		APIResponse<ComplianceRecordResponseDTO> response = APIResponse.<ComplianceRecordResponseDTO>builder()
				.status("SUCCESS").message("Compliance record created successfully").data(record).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('COMPLIANCE_OFFICER','AUDITOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@GetMapping("/entity/{entityId}")
	public ResponseEntity<APIResponse<List<ComplianceRecordResponseDTO>>> getComplianceRecordsByEntityId(
			@PathVariable Long entityId) {

		List<ComplianceRecordResponseDTO> records = complianceRecordService.getComplianceRecordsByEntityId(entityId);

		APIResponse<List<ComplianceRecordResponseDTO>> response = APIResponse
				.<List<ComplianceRecordResponseDTO>>builder().status("SUCCESS")
				.message("Compliance records fetched successfully by entity ID").data(records).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('COMPLIANCE_OFFICER','AUDITOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@GetMapping("/type/{type}")
	public ResponseEntity<APIResponse<List<ComplianceRecordResponseDTO>>> getComplianceRecordsByType(
			@PathVariable ComplianceEntityType type) {

		List<ComplianceRecordResponseDTO> records = complianceRecordService.getComplianceRecordsByType(type);

		APIResponse<List<ComplianceRecordResponseDTO>> response = APIResponse
				.<List<ComplianceRecordResponseDTO>>builder().status("SUCCESS")
				.message("Compliance records fetched successfully by entity type").data(records).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('COMPLIANCE_OFFICER','ADMIN','HEALTH_ADMINISTRATOR')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<ComplianceRecordResponseDTO>> updateComplianceRecord(@PathVariable Long id,
			@Valid @RequestBody UpdateComplianceRecordRequestDTO requestDTO) {

		ComplianceRecordResponseDTO record = complianceRecordService.updateComplianceRecord(id, requestDTO);

		APIResponse<ComplianceRecordResponseDTO> response = APIResponse.<ComplianceRecordResponseDTO>builder()
				.status("SUCCESS").message("Compliance record updated successfully").data(record).build();

		return ResponseEntity.ok(response);
	}
}