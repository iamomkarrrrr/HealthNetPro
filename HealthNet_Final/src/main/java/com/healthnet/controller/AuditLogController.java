package com.healthnet.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnet.api.APIResponse;
import com.healthnet.responsedto.AuditLogResponseDTO;
import com.healthnet.service.AuditLogService;

@RestController
@RequestMapping("/api/v1/audit-logs")
public class AuditLogController {

	private final AuditLogService auditLogService;

	public AuditLogController(AuditLogService auditLogService) {
		this.auditLogService = auditLogService;
	}

	@PreAuthorize("hasAnyRole('ADMIN','AUDITOR','HEALTH_ADMINISTRATOR')")
	@GetMapping
	public ResponseEntity<APIResponse<List<AuditLogResponseDTO>>> getAllAuditLogs() {

		List<AuditLogResponseDTO> auditLogs = auditLogService.getAllAuditLogs();

		APIResponse<List<AuditLogResponseDTO>> response = APIResponse.<List<AuditLogResponseDTO>>builder()
				.status("SUCCESS").message("Audit logs fetched successfully").data(auditLogs).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','AUDITOR','HEALTH_ADMINISTRATOR')")
	@GetMapping("/{id}")
	public ResponseEntity<APIResponse<AuditLogResponseDTO>> getAuditLogById(@PathVariable Long id) {

		AuditLogResponseDTO auditLog = auditLogService.getAuditLogById(id);

		APIResponse<AuditLogResponseDTO> response = APIResponse.<AuditLogResponseDTO>builder().status("SUCCESS")
				.message("Audit log fetched successfully").data(auditLog).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','AUDITOR','HEALTH_ADMINISTRATOR')")
	@GetMapping("/user/{userId}")
	public ResponseEntity<APIResponse<List<AuditLogResponseDTO>>> getAuditLogsByUserId(@PathVariable Long userId) {

		List<AuditLogResponseDTO> auditLogs = auditLogService.getAuditLogsByUserId(userId);

		APIResponse<List<AuditLogResponseDTO>> response = APIResponse.<List<AuditLogResponseDTO>>builder()
				.status("SUCCESS").message("Audit logs by user fetched successfully").data(auditLogs).build();

		return ResponseEntity.ok(response);
	}
}