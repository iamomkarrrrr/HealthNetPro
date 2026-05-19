package com.healthnet.controller;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.healthnet.api.APIResponse;
import com.healthnet.enums.DocumentType;
import com.healthnet.responsedto.CitizenDocumentResponseDTO;
import com.healthnet.resquestdto.CreateCitizenDocumentRequestDTO;
import com.healthnet.resquestdto.UpdateCitizenDocumentStatusRequestDTO;
import com.healthnet.service.CitizenDocumentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/citizen-documents")
public class CitizenDocumentController {

	private final CitizenDocumentService citizenDocumentService;

	public CitizenDocumentController(CitizenDocumentService citizenDocumentService) {
		this.citizenDocumentService = citizenDocumentService;
	}

	@PreAuthorize("hasRole('CITIZEN')")
	@PostMapping
	public ResponseEntity<APIResponse<CitizenDocumentResponseDTO>> createCitizenDocument(
			@Valid @RequestBody CreateCitizenDocumentRequestDTO requestDTO) {

		CitizenDocumentResponseDTO citizenDocument = citizenDocumentService.createCitizenDocument(requestDTO);

		APIResponse<CitizenDocumentResponseDTO> response = APIResponse.<CitizenDocumentResponseDTO>builder()
				.status("SUCCESS").message("Citizen document created successfully").data(citizenDocument).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasRole('CITIZEN')")
	@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<APIResponse<CitizenDocumentResponseDTO>> uploadCitizenDocument(@RequestParam Long citizenId,
			@RequestParam DocumentType docType, @RequestParam MultipartFile file) {

		CitizenDocumentResponseDTO citizenDocument = citizenDocumentService.uploadCitizenDocument(citizenId, docType,
				file);

		APIResponse<CitizenDocumentResponseDTO> response = APIResponse.<CitizenDocumentResponseDTO>builder()
				.status("SUCCESS").message("Citizen document uploaded successfully").data(citizenDocument).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('CITIZEN','ADMIN','COMPLIANCE_OFFICER','HEALTH_ADMINISTRATOR')")
	@GetMapping("/{id}/download")
	public ResponseEntity<Resource> downloadCitizenDocument(@PathVariable Long id) {

		Resource resource = citizenDocumentService.downloadCitizenDocument(id);

		return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF)
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
				.body(resource);
	}

	@PreAuthorize("hasAnyRole('CITIZEN','ADMIN','COMPLIANCE_OFFICER','HEALTH_ADMINISTRATOR')")
	@GetMapping("/citizen/{citizenId}")
	public ResponseEntity<APIResponse<List<CitizenDocumentResponseDTO>>> getCitizenDocumentsByCitizenId(
			@PathVariable Long citizenId) {

		List<CitizenDocumentResponseDTO> citizenDocuments = citizenDocumentService
				.getCitizenDocumentsByCitizenId(citizenId);

		APIResponse<List<CitizenDocumentResponseDTO>> response = APIResponse.<List<CitizenDocumentResponseDTO>>builder()
				.status("SUCCESS").message("Citizen documents fetched successfully").data(citizenDocuments).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','COMPLIANCE_OFFICER','HEALTH_ADMINISTRATOR')")
	@PatchMapping("/{id}/status")
	public ResponseEntity<APIResponse<CitizenDocumentResponseDTO>> updateCitizenDocumentStatus(@PathVariable Long id,
			@Valid @RequestBody UpdateCitizenDocumentStatusRequestDTO requestDTO) {

		CitizenDocumentResponseDTO citizenDocument = citizenDocumentService.updateCitizenDocumentStatus(id, requestDTO);

		APIResponse<CitizenDocumentResponseDTO> response = APIResponse.<CitizenDocumentResponseDTO>builder()
				.status("SUCCESS").message("Citizen document status updated successfully").data(citizenDocument)
				.build();

		return ResponseEntity.ok(response);
	}
}