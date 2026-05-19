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
import com.healthnet.responsedto.DiseaseCaseResponseDTO;
import com.healthnet.resquestdto.CreateDiseaseCaseRequestDTO;
import com.healthnet.resquestdto.UpdateDiseaseCaseRequestDTO;
import com.healthnet.service.DiseaseCaseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/disease-cases")
public class DiseaseCaseController {

	private final DiseaseCaseService diseaseCaseService;

	public DiseaseCaseController(DiseaseCaseService diseaseCaseService) {
		this.diseaseCaseService = diseaseCaseService;
	}

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@PostMapping
	public ResponseEntity<APIResponse<DiseaseCaseResponseDTO>> createDiseaseCase(
			@Valid @RequestBody CreateDiseaseCaseRequestDTO requestDTO) {

		DiseaseCaseResponseDTO diseaseCase = diseaseCaseService.createDiseaseCase(requestDTO);

		APIResponse<DiseaseCaseResponseDTO> response = APIResponse.<DiseaseCaseResponseDTO>builder().status("SUCCESS")
				.message("Disease case created successfully").data(diseaseCase).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('DOCTOR','EPIDEMIOLOGIST','ADMIN','COMPLIANCE_OFFICER','HEALTH_ADMINISTRATOR')")
	@GetMapping("/{id}")
	public ResponseEntity<APIResponse<DiseaseCaseResponseDTO>> getDiseaseCaseById(@PathVariable Long id) {

		DiseaseCaseResponseDTO diseaseCase = diseaseCaseService.getDiseaseCaseById(id);

		APIResponse<DiseaseCaseResponseDTO> response = APIResponse.<DiseaseCaseResponseDTO>builder().status("SUCCESS")
				.message("Disease case fetched successfully").data(diseaseCase).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('DOCTOR','EPIDEMIOLOGIST','ADMIN','COMPLIANCE_OFFICER','HEALTH_ADMINISTRATOR')")
	@GetMapping
	public ResponseEntity<APIResponse<List<DiseaseCaseResponseDTO>>> getAllDiseaseCases() {

		List<DiseaseCaseResponseDTO> diseaseCases = diseaseCaseService.getAllDiseaseCases();

		APIResponse<List<DiseaseCaseResponseDTO>> response = APIResponse.<List<DiseaseCaseResponseDTO>>builder()
				.status("SUCCESS").message("Disease cases fetched successfully").data(diseaseCases).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('DOCTOR','ADMIN','HEALTH_ADMINISTRATOR')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<DiseaseCaseResponseDTO>> updateDiseaseCase(@PathVariable Long id,
			@Valid @RequestBody UpdateDiseaseCaseRequestDTO requestDTO) {

		DiseaseCaseResponseDTO diseaseCase = diseaseCaseService.updateDiseaseCase(id, requestDTO);

		APIResponse<DiseaseCaseResponseDTO> response = APIResponse.<DiseaseCaseResponseDTO>builder().status("SUCCESS")
				.message("Disease case updated successfully").data(diseaseCase).build();

		return ResponseEntity.ok(response);
	}
}
