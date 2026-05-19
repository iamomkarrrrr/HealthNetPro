package com.healthnet.service.impl;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.healthnet.entity.User;
import com.healthnet.enums.UserRole;
import com.healthnet.enums.UserStatus;
import com.healthnet.exception.InvalidCredentialsException;
import com.healthnet.exception.InvalidPasswordException;
import com.healthnet.exception.UserNotFoundException;
import com.healthnet.repository.CitizenRepository;
import com.healthnet.repository.UserRepository;
import com.healthnet.responsedto.LoginResponseDTO;
import com.healthnet.resquestdto.ChangePasswordRequestDTO;
import com.healthnet.resquestdto.LoginRequestDTO;
import com.healthnet.security.JwtService;
import com.healthnet.service.AuthService;

@Service
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final CitizenRepository citizenRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final CustomUserDetailsService customUserDetailsService;

	public AuthServiceImpl(UserRepository userRepository, CitizenRepository citizenRepository,
			PasswordEncoder passwordEncoder, JwtService jwtService, CustomUserDetailsService customUserDetailsService) {
		this.userRepository = userRepository;
		this.citizenRepository = citizenRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.customUserDetailsService = customUserDetailsService;
	}

	@Override
	public LoginResponseDTO login(LoginRequestDTO requestDTO) {

		User user = userRepository.findByEmail(requestDTO.getEmail())
				.orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

		if (!passwordEncoder.matches(requestDTO.getPassword(), user.getPassword())) {
			throw new InvalidCredentialsException("Invalid email or password");
		}

		if (user.getRole() != requestDTO.getRole()) {
			throw new InvalidCredentialsException("Selected role does not match this user account");
		}

		if (user.getStatus() != UserStatus.ACTIVE) {
			throw new InvalidCredentialsException("User account is not active");
		}

		UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());

		String token = jwtService.generateToken(userDetails);

		Boolean citizenProfileCompleted = null;

		if (user.getRole() == UserRole.CITIZEN) {
			citizenProfileCompleted = citizenRepository.existsByUserId(user.getId());
		}

		return LoginResponseDTO.builder().token(token).userId(user.getId()).name(user.getName()).email(user.getEmail())
				.role(user.getRole()).status(user.getStatus()).citizenProfileCompleted(citizenProfileCompleted).build();
	}

	@Override
	public void changePassword(ChangePasswordRequestDTO requestDTO) {

		User user = userRepository.findById(requestDTO.getUserId())
				.orElseThrow(() -> new UserNotFoundException("User not found with id: " + requestDTO.getUserId()));

		if (!passwordEncoder.matches(requestDTO.getOldPassword(), user.getPassword())) {
			throw new InvalidPasswordException("Old password is incorrect");
		}

		user.setPassword(passwordEncoder.encode(requestDTO.getNewPassword()));

		userRepository.save(user);
	}
}