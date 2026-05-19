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
import com.healthnet.responsedto.EpidemiologyDataResponseDTO;
import com.healthnet.resquestdto.CreateEpidemiologyDataRequestDTO;
import com.healthnet.resquestdto.UpdateEpidemiologyDataRequestDTO;
import com.healthnet.service.EpidemiologyDataService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/epidemiology-data")
public class EpidemiologyDataController {

	private final EpidemiologyDataService epidemiologyDataService;

	public EpidemiologyDataController(EpidemiologyDataService epidemiologyDataService) {
		this.epidemiologyDataService = epidemiologyDataService;
	}

	@PreAuthorize("hasAnyRole('EPIDEMIOLOGIST','ADMIN','HEALTH_ADMINISTRATOR')")
	@PostMapping
	public ResponseEntity<APIResponse<EpidemiologyDataResponseDTO>> createEpidemiologyData(
			@Valid @RequestBody CreateEpidemiologyDataRequestDTO requestDTO) {

		EpidemiologyDataResponseDTO data = epidemiologyDataService.createEpidemiologyData(requestDTO);

		APIResponse<EpidemiologyDataResponseDTO> response = APIResponse.<EpidemiologyDataResponseDTO>builder()
				.status("SUCCESS").message("Epidemiology data created successfully").data(data).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('EPIDEMIOLOGIST','ADMIN','COMPLIANCE_OFFICER','HEALTH_ADMINISTRATOR')")
	@GetMapping("/outbreak/{outbreakId}")
	public ResponseEntity<APIResponse<List<EpidemiologyDataResponseDTO>>> getEpidemiologyDataByOutbreakId(
			@PathVariable Long outbreakId) {

		List<EpidemiologyDataResponseDTO> dataList = epidemiologyDataService
				.getEpidemiologyDataByOutbreakId(outbreakId);

		APIResponse<List<EpidemiologyDataResponseDTO>> response = APIResponse
				.<List<EpidemiologyDataResponseDTO>>builder().status("SUCCESS")
				.message("Epidemiology data fetched successfully").data(dataList).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('EPIDEMIOLOGIST','ADMIN','HEALTH_ADMINISTRATOR')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<EpidemiologyDataResponseDTO>> updateEpidemiologyData(@PathVariable Long id,
			@Valid @RequestBody UpdateEpidemiologyDataRequestDTO requestDTO) {

		EpidemiologyDataResponseDTO updatedData = epidemiologyDataService.updateEpidemiologyData(id, requestDTO);

		APIResponse<EpidemiologyDataResponseDTO> response = APIResponse.<EpidemiologyDataResponseDTO>builder()
				.status("SUCCESS").message("Epidemiology data updated successfully").data(updatedData).build();

		return ResponseEntity.ok(response);
	}
}