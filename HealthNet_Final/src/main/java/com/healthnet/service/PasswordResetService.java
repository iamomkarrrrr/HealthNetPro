package com.healthnet.service;

import com.healthnet.resquestdto.ForgotPasswordRequestDTO;
import com.healthnet.resquestdto.ResetPasswordRequestDTO;
import com.healthnet.resquestdto.VerifyOtpRequestDTO;

public interface PasswordResetService {

	void requestOtp(ForgotPasswordRequestDTO requestDTO);

	void verifyOtp(VerifyOtpRequestDTO requestDTO);

	void resetPassword(ResetPasswordRequestDTO requestDTO);
}