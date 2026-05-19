package com.healthnet.controller;

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
import com.healthnet.responsedto.HealthProfileResponseDTO;
import com.healthnet.resquestdto.CreateHealthProfileRequestDTO;
import com.healthnet.resquestdto.UpdateHealthProfileRequestDTO;
import com.healthnet.service.HealthProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/health-profiles")
public class HealthProfileController {

	private final HealthProfileService healthProfileService;

	public HealthProfileController(HealthProfileService healthProfileService) {
		this.healthProfileService = healthProfileService;
	}

	@PreAuthorize("hasRole('CITIZEN')")
	@PostMapping
	public ResponseEntity<APIResponse<HealthProfileResponseDTO>> createHealthProfile(
			@Valid @RequestBody CreateHealthProfileRequestDTO requestDTO) {

		HealthProfileResponseDTO healthProfile = healthProfileService.createHealthProfile(requestDTO);

		APIResponse<HealthProfileResponseDTO> response = APIResponse.<HealthProfileResponseDTO>builder()
				.status("SUCCESS").message("Health profile created successfully").data(healthProfile).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('CITIZEN','DOCTOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@GetMapping("/{id}")
	public ResponseEntity<APIResponse<HealthProfileResponseDTO>> getHealthProfileById(@PathVariable Long id) {

		HealthProfileResponseDTO healthProfile = healthProfileService.getHealthProfileById(id);

		APIResponse<HealthProfileResponseDTO> response = APIResponse.<HealthProfileResponseDTO>builder()
				.status("SUCCESS").message("Health profile fetched successfully").data(healthProfile).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('CITIZEN','DOCTOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@GetMapping("/citizen/{citizenId}")
	public ResponseEntity<APIResponse<HealthProfileResponseDTO>> getHealthProfileByCitizenId(
			@PathVariable Long citizenId) {

		HealthProfileResponseDTO healthProfile = healthProfileService.getHealthProfileByCitizenId(citizenId);

		APIResponse<HealthProfileResponseDTO> response = APIResponse.<HealthProfileResponseDTO>builder()
				.status("SUCCESS").message("Health profile fetched successfully by citizen id").data(healthProfile)
				.build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasRole('CITIZEN')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<HealthProfileResponseDTO>> updateHealthProfile(@PathVariable Long id,
			@Valid @RequestBody UpdateHealthProfileRequestDTO requestDTO) {

		HealthProfileResponseDTO healthProfile = healthProfileService.updateHealthProfile(id, requestDTO);

		APIResponse<HealthProfileResponseDTO> response = APIResponse.<HealthProfileResponseDTO>builder()
				.status("SUCCESS").message("Health profile updated successfully").data(healthProfile).build();

		return ResponseEntity.ok(response);
	}
}