package com.healthnet.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnet.api.APIResponse;
import com.healthnet.responsedto.UserResponseDTO;
import com.healthnet.resquestdto.RegisterUserRequestDTO;
import com.healthnet.resquestdto.UpdateUserRequestDTO;
import com.healthnet.resquestdto.UpdateUserStatusRequestDTO;
import com.healthnet.service.CreateUserRequestDTO;
import com.healthnet.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<APIResponse<UserResponseDTO>> registerCitizenUser(
			@Valid @RequestBody RegisterUserRequestDTO requestDTO) {

		UserResponseDTO registeredUser = userService.registerCitizenUser(requestDTO);

		APIResponse<UserResponseDTO> response = APIResponse.<UserResponseDTO>builder().status("SUCCESS")
				.message("User registered successfully with CITIZEN role").data(registeredUser).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','HEALTH_ADMINISTRATOR')")
	@PostMapping
	public ResponseEntity<APIResponse<UserResponseDTO>> createUser(
			@Valid @RequestBody CreateUserRequestDTO requestDTO) {

		UserResponseDTO createdUser = userService.createUser(requestDTO);

		APIResponse<UserResponseDTO> response = APIResponse.<UserResponseDTO>builder().status("SUCCESS")
				.message("User created successfully").data(createdUser).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','HEALTH_ADMINISTRATOR')")
	@GetMapping("/{id}")
	public ResponseEntity<APIResponse<UserResponseDTO>> getUserById(@PathVariable Long id) {

		UserResponseDTO user = userService.getUserById(id);

		APIResponse<UserResponseDTO> response = APIResponse.<UserResponseDTO>builder().status("SUCCESS")
				.message("User fetched successfully").data(user).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','HEALTH_ADMINISTRATOR')")
	@GetMapping
	public ResponseEntity<APIResponse<List<UserResponseDTO>>> getAllUsers() {

		List<UserResponseDTO> users = userService.getAllUsers();

		APIResponse<List<UserResponseDTO>> response = APIResponse.<List<UserResponseDTO>>builder().status("SUCCESS")
				.message("Users fetched successfully").data(users).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','HEALTH_ADMINISTRATOR')")
	@PutMapping("/{id}")
	public ResponseEntity<APIResponse<UserResponseDTO>> updateUser(@PathVariable Long id,
			@Valid @RequestBody UpdateUserRequestDTO requestDTO) {

		UserResponseDTO updatedUser = userService.updateUser(id, requestDTO);

		APIResponse<UserResponseDTO> response = APIResponse.<UserResponseDTO>builder().status("SUCCESS")
				.message("User updated successfully").data(updatedUser).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','HEALTH_ADMINISTRATOR')")
	@PatchMapping("/{id}/status")
	public ResponseEntity<APIResponse<UserResponseDTO>> updateUserStatus(@PathVariable Long id,
			@Valid @RequestBody UpdateUserStatusRequestDTO requestDTO) {

		UserResponseDTO updatedUser = userService.updateUserStatus(id, requestDTO);

		APIResponse<UserResponseDTO> response = APIResponse.<UserResponseDTO>builder().status("SUCCESS")
				.message("User status updated successfully").data(updatedUser).build();

		return ResponseEntity.ok(response);
	}
}