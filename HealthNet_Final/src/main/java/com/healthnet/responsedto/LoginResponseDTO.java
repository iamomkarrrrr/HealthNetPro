package com.healthnet.responsedto;

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
public class LoginResponseDTO {

	private String token;

	private Long userId;

	private String name;

	private String email;

	private UserRole role;

	private UserStatus status;

	private Boolean citizenProfileCompleted;
}