package com.healthnet.service;

import com.healthnet.responsedto.LoginResponseDTO;
import com.healthnet.resquestdto.ChangePasswordRequestDTO;
import com.healthnet.resquestdto.LoginRequestDTO;

public interface AuthService {

	void changePassword(ChangePasswordRequestDTO requestDTO);

	LoginResponseDTO login(LoginRequestDTO requestDTO);
}