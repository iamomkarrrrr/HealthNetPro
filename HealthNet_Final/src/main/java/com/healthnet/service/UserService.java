package com.healthnet.service;

import java.util.List;

import com.healthnet.responsedto.UserResponseDTO;
import com.healthnet.resquestdto.RegisterUserRequestDTO;
import com.healthnet.resquestdto.UpdateUserRequestDTO;
import com.healthnet.resquestdto.UpdateUserStatusRequestDTO;

public interface UserService {

	UserResponseDTO registerCitizenUser(RegisterUserRequestDTO requestDTO);

	UserResponseDTO createUser(CreateUserRequestDTO requestDTO);

	UserResponseDTO getUserById(Long id);

	List<UserResponseDTO> getAllUsers();

	UserResponseDTO updateUser(Long id, UpdateUserRequestDTO requestDTO);

	UserResponseDTO updateUserStatus(Long id, UpdateUserStatusRequestDTO requestDTO);
}