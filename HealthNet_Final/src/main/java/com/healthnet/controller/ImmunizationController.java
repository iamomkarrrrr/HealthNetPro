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
import com.healthnet.responsedto.ImmunizationResponseDTO;
import com.healthnet.resquestdto.CreateImmunizationRequestDTO;
import com.healthnet.resquestdto.UpdateImmunizationRequestDTO;
import com.healthnet.service.ImmunizationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/immunizations")
public class ImmunizationController {

	private final ImmunizationService immunizationService;

	public ImmunizationController(ImmunizationService immunizationService) {
		this.immunizationService = immunizationService;
	}

	@PreAuthorize("hasAnyRole('HEALTH_ADMINISTRATOR','DOCTOR','ADMIN')")
	@PostMapping
	public ResponseEntity<APIResponse<ImmunizationResponseDTO>> createImmunization(
			@Valid @RequestBody CreateImmunizationRequestDTO requestDTO) {

		ImmunizationResponseDTO immunization = immunizationService.createImmunization(requestDTO);

		APIResponse<ImmunizationResponseDTO> response = APIResponse.<ImmunizationResponseDTO>builder().status("SUCCESS")
				.message("Immunization record created successfully").data(immunization).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('CITIZEN','DOCTOR','HEALTH_ADMINISTRATOR','ADMIN')")
	@GetMapping("/citizen/{citizenId}")
	public ResponseEntity<APIResponse<List<ImmunizationResponseDTO>>> getImmunizationsByCitizenId(
			@PathVariable Long citizenId) {

		List<ImmunizationResponseDTO> immunizations = immunizationService.getImmunizationsByCitizenId(citizenId);

		APIResponse<List<ImmunizationResponseDTO>> response = APIResponse.<List<ImmunizationResponseDTO>>builder()
				.status("SUCCESS").message("Immunization records fetched successfully").data(immunizations).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('HEALTH_ADMINISTRATOR','DOCTOR','ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<ImmunizationResponseDTO>> updateImmunization(@PathVariable Long id,
			@Valid @RequestBody UpdateImmunizationRequestDTO requestDTO) {

		ImmunizationResponseDTO immunization = immunizationService.updateImmunization(id, requestDTO);

		APIResponse<ImmunizationResponseDTO> response = APIResponse.<ImmunizationResponseDTO>builder().status("SUCCESS")
				.message("Immunization record updated successfully").data(immunization).build();

		return ResponseEntity.ok(response);
	}
}