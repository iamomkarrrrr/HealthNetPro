package com.healthnet.mapper;

import com.healthnet.entity.User;
import com.healthnet.responsedto.UserResponseDTO;
import com.healthnet.resquestdto.RegisterUserRequestDTO;
import com.healthnet.service.CreateUserRequestDTO;

public class UserMapper {

	public static User toEntity(CreateUserRequestDTO requestDTO) {
		return User.builder().name(requestDTO.getName()).email(requestDTO.getEmail()).phone(requestDTO.getPhone())
				.role(requestDTO.getRole()).build();
	}

	public static User toEntity(RegisterUserRequestDTO requestDTO) {
		return User.builder().name(requestDTO.getName()).email(requestDTO.getEmail()).phone(requestDTO.getPhone())
				.build();
	}

	public static UserResponseDTO toResponseDTO(User user) {
		return UserResponseDTO.builder().id(user.getId()).name(user.getName()).email(user.getEmail())
				.phone(user.getPhone()).role(user.getRole()).status(user.getStatus()).createdAt(user.getCreatedAt())
				.updatedAt(user.getUpdatedAt()).build();
	}
}