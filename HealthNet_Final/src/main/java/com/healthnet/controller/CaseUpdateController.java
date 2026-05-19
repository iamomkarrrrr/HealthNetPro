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
import com.healthnet.responsedto.CaseUpdateResponseDTO;
import com.healthnet.resquestdto.CreateCaseUpdateRequestDTO;
import com.healthnet.resquestdto.UpdateCaseUpdateRequestDTO;
import com.healthnet.service.CaseUpdateService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/case-updates")
public class CaseUpdateController {

	private final CaseUpdateService caseUpdateService;

	public CaseUpdateController(CaseUpdateService caseUpdateService) {
		this.caseUpdateService = caseUpdateService;
	}

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@PostMapping
	public ResponseEntity<APIResponse<CaseUpdateResponseDTO>> createCaseUpdate(
			@Valid @RequestBody CreateCaseUpdateRequestDTO requestDTO) {

		CaseUpdateResponseDTO caseUpdate = caseUpdateService.createCaseUpdate(requestDTO);

		APIResponse<CaseUpdateResponseDTO> response = APIResponse.<CaseUpdateResponseDTO>builder().status("SUCCESS")
				.message("Case update created successfully").data(caseUpdate).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('DOCTOR','EPIDEMIOLOGIST','ADMIN','HEALTH_ADMINISTRATOR')")
	@GetMapping("/case/{caseId}")
	public ResponseEntity<APIResponse<List<CaseUpdateResponseDTO>>> getCaseUpdatesByCaseId(@PathVariable Long caseId) {

		List<CaseUpdateResponseDTO> caseUpdates = caseUpdateService.getCaseUpdatesByCaseId(caseId);

		APIResponse<List<CaseUpdateResponseDTO>> response = APIResponse.<List<CaseUpdateResponseDTO>>builder()
				.status("SUCCESS").message("Case updates fetched successfully").data(caseUpdates).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<CaseUpdateResponseDTO>> updateCaseUpdate(@PathVariable Long id,
			@Valid @RequestBody UpdateCaseUpdateRequestDTO requestDTO) {

		CaseUpdateResponseDTO caseUpdate = caseUpdateService.updateCaseUpdate(id, requestDTO);

		APIResponse<CaseUpdateResponseDTO> response = APIResponse.<CaseUpdateResponseDTO>builder().status("SUCCESS")
				.message("Case update updated successfully").data(caseUpdate).build();

		return ResponseEntity.ok(response);
	}
}