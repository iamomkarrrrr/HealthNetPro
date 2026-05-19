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
import com.healthnet.enums.AuditStatus;
import com.healthnet.responsedto.AuditResponseDTO;
import com.healthnet.resquestdto.CreateAuditRequestDTO;
import com.healthnet.resquestdto.UpdateAuditRequestDTO;
import com.healthnet.service.AuditService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/audits")
public class AuditController {

	private final AuditService auditService;

	public AuditController(AuditService auditService) {
		this.auditService = auditService;
	}

	@PreAuthorize("hasAnyRole('AUDITOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@PostMapping
	public ResponseEntity<APIResponse<AuditResponseDTO>> createAudit(
			@Valid @RequestBody CreateAuditRequestDTO requestDTO) {

		AuditResponseDTO audit = auditService.createAudit(requestDTO);

		APIResponse<AuditResponseDTO> response = APIResponse.<AuditResponseDTO>builder().status("SUCCESS")
				.message("Audit created successfully").data(audit).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('AUDITOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@GetMapping("/officer/{officerId}")
	public ResponseEntity<APIResponse<List<AuditResponseDTO>>> getAuditsByOfficerId(@PathVariable Long officerId) {

		List<AuditResponseDTO> audits = auditService.getAuditsByOfficerId(officerId);

		APIResponse<List<AuditResponseDTO>> response = APIResponse.<List<AuditResponseDTO>>builder().status("SUCCESS")
				.message("Audits fetched successfully by officer").data(audits).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('AUDITOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@GetMapping("/status/{status}")
	public ResponseEntity<APIResponse<List<AuditResponseDTO>>> getAuditsByStatus(@PathVariable AuditStatus status) {

		List<AuditResponseDTO> audits = auditService.getAuditsByStatus(status);

		APIResponse<List<AuditResponseDTO>> response = APIResponse.<List<AuditResponseDTO>>builder().status("SUCCESS")
				.message("Audits fetched successfully by status").data(audits).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('AUDITOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<AuditResponseDTO>> updateAudit(@PathVariable Long id,
			@Valid @RequestBody UpdateAuditRequestDTO requestDTO) {

		AuditResponseDTO audit = auditService.updateAudit(id, requestDTO);

		APIResponse<AuditResponseDTO> response = APIResponse.<AuditResponseDTO>builder().status("SUCCESS")
				.message("Audit updated successfully").data(audit).build();

		return ResponseEntity.ok(response);
	}
}