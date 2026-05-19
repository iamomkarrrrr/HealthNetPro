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
import com.healthnet.responsedto.VaccinationProgramResponseDTO;
import com.healthnet.resquestdto.CreateVaccinationProgramRequestDTO;
import com.healthnet.resquestdto.UpdateVaccinationProgramRequestDTO;
import com.healthnet.service.VaccinationProgramService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/vaccination-programs")
public class VaccinationProgramController {

	private final VaccinationProgramService vaccinationProgramService;

	public VaccinationProgramController(VaccinationProgramService vaccinationProgramService) {
		this.vaccinationProgramService = vaccinationProgramService;
	}

	@PreAuthorize("hasAnyRole('HEALTH_ADMINISTRATOR','ADMIN')")
	@PostMapping
	public ResponseEntity<APIResponse<VaccinationProgramResponseDTO>> createVaccinationProgram(
			@Valid @RequestBody CreateVaccinationProgramRequestDTO requestDTO) {

		VaccinationProgramResponseDTO program = vaccinationProgramService.createVaccinationProgram(requestDTO);

		APIResponse<VaccinationProgramResponseDTO> response = APIResponse.<VaccinationProgramResponseDTO>builder()
				.status("SUCCESS").message("Vaccination program created successfully").data(program).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/{id}")
	public ResponseEntity<APIResponse<VaccinationProgramResponseDTO>> getVaccinationProgramById(@PathVariable Long id) {

		VaccinationProgramResponseDTO program = vaccinationProgramService.getVaccinationProgramById(id);

		APIResponse<VaccinationProgramResponseDTO> response = APIResponse.<VaccinationProgramResponseDTO>builder()
				.status("SUCCESS").message("Vaccination program fetched successfully").data(program).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping
	public ResponseEntity<APIResponse<List<VaccinationProgramResponseDTO>>> getAllVaccinationPrograms() {

		List<VaccinationProgramResponseDTO> programs = vaccinationProgramService.getAllVaccinationPrograms();

		APIResponse<List<VaccinationProgramResponseDTO>> response = APIResponse
				.<List<VaccinationProgramResponseDTO>>builder().status("SUCCESS")
				.message("Vaccination programs fetched successfully").data(programs).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('HEALTH_ADMINISTRATOR','ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<VaccinationProgramResponseDTO>> updateVaccinationProgram(@PathVariable Long id,
			@Valid @RequestBody UpdateVaccinationProgramRequestDTO requestDTO) {

		VaccinationProgramResponseDTO program = vaccinationProgramService.updateVaccinationProgram(id, requestDTO);

		APIResponse<VaccinationProgramResponseDTO> response = APIResponse.<VaccinationProgramResponseDTO>builder()
				.status("SUCCESS").message("Vaccination program updated successfully").data(program).build();

		return ResponseEntity.ok(response);
	}
}