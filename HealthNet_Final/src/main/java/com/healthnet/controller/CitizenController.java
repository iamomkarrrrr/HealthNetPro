package com.healthnet.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnet.api.APIResponse;
import com.healthnet.entity.User;
import com.healthnet.repository.UserRepository;
import com.healthnet.responsedto.CitizenResponseDTO;
import com.healthnet.resquestdto.CreateCitizenRequestDTO;
import com.healthnet.resquestdto.UpdateCitizenRequestDTO;
import com.healthnet.resquestdto.UpdateCitizenStatusRequestDTO;
import com.healthnet.service.CitizenService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/citizens")
public class CitizenController {

	private final CitizenService citizenService;
	private final UserRepository userRepository;

	public CitizenController(CitizenService citizenService, UserRepository userRepository) {
		this.citizenService = citizenService;
		this.userRepository = userRepository;
	}

	@PreAuthorize("hasRole('CITIZEN')")
	@PostMapping("/profile")
	public ResponseEntity<APIResponse<CitizenResponseDTO>> createMyCitizenProfile(
			@Valid @RequestBody CreateCitizenRequestDTO requestDTO) {

		Long loggedInUserId = getLoggedInUserId();

		CitizenResponseDTO citizen = citizenService.createCitizen(loggedInUserId, requestDTO);

		APIResponse<CitizenResponseDTO> response = APIResponse.<CitizenResponseDTO>builder().status("SUCCESS")
				.message("Citizen profile created successfully").data(citizen).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasRole('CITIZEN')")
	@GetMapping("/me")
	public ResponseEntity<APIResponse<CitizenResponseDTO>> getMyCitizenProfile() {

		Long loggedInUserId = getLoggedInUserId();

		CitizenResponseDTO citizen = citizenService.getCitizenByUserId(loggedInUserId);

		APIResponse<CitizenResponseDTO> response = APIResponse.<CitizenResponseDTO>builder().status("SUCCESS")
				.message("Citizen profile fetched successfully").data(citizen).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasRole('CITIZEN')")
	@PutMapping("/me")
	public ResponseEntity<APIResponse<CitizenResponseDTO>> updateMyCitizenProfile(
			@Valid @RequestBody UpdateCitizenRequestDTO requestDTO) {

		Long loggedInUserId = getLoggedInUserId();

		CitizenResponseDTO citizen = citizenService.updateCitizenByUserId(loggedInUserId, requestDTO);

		APIResponse<CitizenResponseDTO> response = APIResponse.<CitizenResponseDTO>builder().status("SUCCESS")
				.message("Citizen profile updated successfully").data(citizen).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','DOCTOR','HEALTH_ADMINISTRATOR','COMPLIANCE_OFFICER')")
	@GetMapping("/{id}")
	public ResponseEntity<APIResponse<CitizenResponseDTO>> getCitizenById(@PathVariable Long id) {

		CitizenResponseDTO citizen = citizenService.getCitizenById(id);

		APIResponse<CitizenResponseDTO> response = APIResponse.<CitizenResponseDTO>builder().status("SUCCESS")
				.message("Citizen fetched successfully").data(citizen).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','DOCTOR','HEALTH_ADMINISTRATOR','COMPLIANCE_OFFICER')")
	@GetMapping
	public ResponseEntity<APIResponse<List<CitizenResponseDTO>>> getAllCitizens() {

		List<CitizenResponseDTO> citizens = citizenService.getAllCitizens();

		APIResponse<List<CitizenResponseDTO>> response = APIResponse.<List<CitizenResponseDTO>>builder()
				.status("SUCCESS").message("Citizens fetched successfully").data(citizens).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','HEALTH_ADMINISTRATOR')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<CitizenResponseDTO>> updateCitizen(@PathVariable Long id,
			@Valid @RequestBody UpdateCitizenRequestDTO requestDTO) {

		CitizenResponseDTO citizen = citizenService.updateCitizen(id, requestDTO);

		APIResponse<CitizenResponseDTO> response = APIResponse.<CitizenResponseDTO>builder().status("SUCCESS")
				.message("Citizen updated successfully").data(citizen).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','HEALTH_ADMINISTRATOR')")
	@PatchMapping("/{id}/status")
	public ResponseEntity<APIResponse<CitizenResponseDTO>> updateCitizenStatus(@PathVariable Long id,
			@Valid @RequestBody UpdateCitizenStatusRequestDTO requestDTO) {

		CitizenResponseDTO citizen = citizenService.updateCitizenStatus(id, requestDTO);

		APIResponse<CitizenResponseDTO> response = APIResponse.<CitizenResponseDTO>builder().status("SUCCESS")
				.message("Citizen status updated successfully").data(citizen).build();

		return ResponseEntity.ok(response);
	}

	private Long getLoggedInUserId() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication == null || authentication.getName() == null) {
			throw new RuntimeException("User is not authenticated");
		}

		String email = authentication.getName();

		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Logged-in user not found with email: " + email));

		return user.getId();
	}
}