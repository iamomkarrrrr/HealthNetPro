package com.healthnet.responsedto;

import java.time.LocalDateTime;

import com.healthnet.enums.UserRole;
import com.healthnet.enums.UserStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDTO {

	private Long id;

	private String name;

	private String email;

	private String phone;

	private UserRole role;

	private UserStatus status;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;
}