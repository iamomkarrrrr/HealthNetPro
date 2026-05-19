package com.healthnet.resquestdto;

import com.healthnet.enums.NotificationCategory;
import com.healthnet.enums.NotificationStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateNotificationRequestDTO {

	@NotNull(message = "User ID is required")
	private Long userId;

	@NotNull(message = "Entity ID is required")
	private Long entityId;

	@NotBlank(message = "Message is required")
	private String message;

	@NotNull(message = "Category is required")
	private NotificationCategory category;

	@NotNull(message = "Status is required")
	private NotificationStatus status;
}
