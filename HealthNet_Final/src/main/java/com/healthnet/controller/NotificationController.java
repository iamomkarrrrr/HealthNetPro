package com.healthnet.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthnet.api.APIResponse;
import com.healthnet.enums.NotificationCategory;
import com.healthnet.responsedto.NotificationResponseDTO;
import com.healthnet.resquestdto.CreateNotificationRequestDTO;
import com.healthnet.resquestdto.UpdateNotificationStatusRequestDTO;
import com.healthnet.service.NotificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

	private final NotificationService notificationService;

	public NotificationController(NotificationService notificationService) {
		this.notificationService = notificationService;
	}

	@PreAuthorize("hasAnyRole('ADMIN','EPIDEMIOLOGIST','HEALTH_ADMINISTRATOR','COMPLIANCE_OFFICER')")
	@PostMapping
	public ResponseEntity<APIResponse<NotificationResponseDTO>> createNotification(
			@Valid @RequestBody CreateNotificationRequestDTO requestDTO) {

		NotificationResponseDTO notification = notificationService.createNotification(requestDTO);

		APIResponse<NotificationResponseDTO> response = APIResponse.<NotificationResponseDTO>builder().status("SUCCESS")
				.message("Notification created successfully").data(notification).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/user/{userId}")
	public ResponseEntity<APIResponse<List<NotificationResponseDTO>>> getNotificationsByUserId(
			@PathVariable Long userId) {

		List<NotificationResponseDTO> notifications = notificationService.getNotificationsByUserId(userId);

		APIResponse<List<NotificationResponseDTO>> response = APIResponse.<List<NotificationResponseDTO>>builder()
				.status("SUCCESS").message("Notifications fetched successfully by user").data(notifications).build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("hasAnyRole('ADMIN','EPIDEMIOLOGIST','HEALTH_ADMINISTRATOR','COMPLIANCE_OFFICER','HEALTH_ADMINISTRATOR')")
	@GetMapping("/category/{category}")
	public ResponseEntity<APIResponse<List<NotificationResponseDTO>>> getNotificationsByCategory(
			@PathVariable NotificationCategory category) {

		List<NotificationResponseDTO> notifications = notificationService.getNotificationsByCategory(category);

		APIResponse<List<NotificationResponseDTO>> response = APIResponse.<List<NotificationResponseDTO>>builder()
				.status("SUCCESS").message("Notifications fetched successfully by category").data(notifications)
				.build();

		return ResponseEntity.ok(response);
	}

	@PreAuthorize("isAuthenticated()")
	@PatchMapping("/{id}/status")
	public ResponseEntity<APIResponse<NotificationResponseDTO>> updateNotificationStatus(@PathVariable Long id,
			@Valid @RequestBody UpdateNotificationStatusRequestDTO requestDTO) {

		NotificationResponseDTO notification = notificationService.updateNotificationStatus(id, requestDTO);

		APIResponse<NotificationResponseDTO> response = APIResponse.<NotificationResponseDTO>builder().status("SUCCESS")
				.message("Notification status updated successfully").data(notification).build();

		return ResponseEntity.ok(response);
	}
}