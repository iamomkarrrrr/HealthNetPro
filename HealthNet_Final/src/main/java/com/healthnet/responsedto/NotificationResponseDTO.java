package com.healthnet.responsedto;

import java.time.LocalDateTime;

import com.healthnet.enums.NotificationCategory;
import com.healthnet.enums.NotificationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationResponseDTO {

	private Long id;

	private Long userId;

	private Long entityId;

	private String message;

	private NotificationCategory category;

	private NotificationStatus status;

	private LocalDateTime createdDate;
}