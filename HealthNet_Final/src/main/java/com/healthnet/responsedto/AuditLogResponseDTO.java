package com.healthnet.responsedto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuditLogResponseDTO {

	private Long id;

	private Long userId;

	private String action;

	private String resource;

	private LocalDateTime timestamp;
}