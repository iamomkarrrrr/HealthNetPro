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
import com.healthnet.responsedto.OutbreakResponseDTO;
import com.healthnet.resquestdto.CreateOutbreakRequestDTO;
import com.healthnet.resquestdto.UpdateOutbreakRequestDTO;
import com.healthnet.service.OutbreakService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/outbreaks")
public class OutbreakController {

	private final OutbreakService outbreakService;

	public OutbreakController(OutbreakService outbreakService) {
		this.outbreakService = outbreakService;
	}

	@PreAuthorize("hasAnyRole('EPIDEMIOLOGIST','ADMIN','HEALTH_ADMINISTRATOR')")
	@PostMapping
	public ResponseEntity<APIResponse<OutbreakResponseDTO>> createOutbreak(
			@Valid @RequestBody CreateOutbreakRequestDTO requestDTO) {

		OutbreakResponseDTO outbreak = outbreakService.createOutbreak(requestDTO);

		APIResponse<OutbreakResponseDTO> response = APIResponse.<OutbreakResponseDTO>builder().status("SUCCESS")
				.message("Outbreak created successfully").data(outbreak).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('EPIDEMIOLOGIST','ADMIN','DOCTOR','HEALTH_ADMINISTRATOR','COMPLIANCE_OFFICER')")
	@GetMapping("/{id}")
	public ResponseEntity<APIResponse<OutbreakResponseDTO>> getOutbreakById(@PathVariable Long id) {

		OutbreakResponseDTO outbreak = outbreakService.getOutbreakById(id);

		APIResponse<OutbreakResponseDTO> response = APIResponse.<OutbreakResponseDTO>builder().status("SUCCESS")
				.message("Outbreak fetched successfully").data(outbreak).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('EPIDEMIOLOGIST','ADMIN','DOCTOR','HEALTH_ADMINISTRATOR','COMPLIANCE_OFFICER','CITIZEN')")
	@GetMapping
	public ResponseEntity<APIResponse<List<OutbreakResponseDTO>>> getAllOutbreaks() {

		List<OutbreakResponseDTO> outbreaks = outbreakService.getAllOutbreaks();

		APIResponse<List<OutbreakResponseDTO>> response = APIResponse.<List<OutbreakResponseDTO>>builder()
				.status("SUCCESS").message("Outbreaks fetched successfully").data(outbreaks).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('EPIDEMIOLOGIST','ADMIN','HEALTH_ADMINISTRATOR')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<OutbreakResponseDTO>> updateOutbreak(@PathVariable Long id,
			@Valid @RequestBody UpdateOutbreakRequestDTO requestDTO) {

		OutbreakResponseDTO outbreak = outbreakService.updateOutbreak(id, requestDTO);

		APIResponse<OutbreakResponseDTO> response = APIResponse.<OutbreakResponseDTO>builder().status("SUCCESS")
				.message("Outbreak updated successfully").data(outbreak).build();

		return ResponseEntity.ok(response);
	}
}