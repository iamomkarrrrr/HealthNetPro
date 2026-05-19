package com.healthnet.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.healthnet.email.service.EmailService;
import com.healthnet.entity.AuditLog;
import com.healthnet.entity.User;
import com.healthnet.enums.UserRole;
import com.healthnet.enums.UserStatus;
import com.healthnet.exception.DuplicateResourceException;
import com.healthnet.exception.UserNotFoundException;
import com.healthnet.mapper.UserMapper;
import com.healthnet.repository.UserRepository;
import com.healthnet.responsedto.UserResponseDTO;
import com.healthnet.resquestdto.RegisterUserRequestDTO;
import com.healthnet.resquestdto.UpdateUserRequestDTO;
import com.healthnet.resquestdto.UpdateUserStatusRequestDTO;
import com.healthnet.service.AuditLogService;
import com.healthnet.service.CreateUserRequestDTO;
import com.healthnet.service.UserService;

@Service
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuditLogService auditLogService;
	private final EmailService emailService;

	public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder,
			AuditLogService auditLogService, EmailService emailService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.auditLogService = auditLogService;
		this.emailService = emailService;
	}

	@Override
	public UserResponseDTO registerCitizenUser(RegisterUserRequestDTO requestDTO) {

		if (userRepository.existsByEmail(requestDTO.getEmail())) {
			throw new DuplicateResourceException("Email already exists: " + requestDTO.getEmail());
		}

		if (userRepository.existsByPhone(requestDTO.getPhone())) {
			throw new DuplicateResourceException("Phone already exists: " + requestDTO.getPhone());
		}

		User user = UserMapper.toEntity(requestDTO);

		user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
		user.setRole(UserRole.CITIZEN);
		user.setStatus(UserStatus.ACTIVE);
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());

		User savedUser = userRepository.save(user);

		emailService.sendRegistrationEmail(savedUser.getEmail(), savedUser.getName());

		saveAuditLog(savedUser.getId(), "REGISTER_CITIZEN_USER", "USER:" + savedUser.getId());

		return UserMapper.toResponseDTO(savedUser);
	}

	@Override
	public UserResponseDTO createUser(CreateUserRequestDTO requestDTO) {

		if (userRepository.existsByEmail(requestDTO.getEmail())) {
			throw new DuplicateResourceException("Email already exists: " + requestDTO.getEmail());
		}

		if (userRepository.existsByPhone(requestDTO.getPhone())) {
			throw new DuplicateResourceException("Phone already exists: " + requestDTO.getPhone());
		}

		User user = UserMapper.toEntity(requestDTO);

		user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
		user.setStatus(UserStatus.ACTIVE);
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());

		User savedUser = userRepository.save(user);

		emailService.sendRegistrationEmail(savedUser.getEmail(), savedUser.getName());

		saveAuditLog(savedUser.getId(), "CREATE_USER", "USER:" + savedUser.getId());

		return UserMapper.toResponseDTO(savedUser);
	}

	@Override
	public UserResponseDTO getUserById(Long id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

		return UserMapper.toResponseDTO(user);
	}

	@Override
	public List<UserResponseDTO> getAllUsers() {
		return userRepository.findAll().stream().map(UserMapper::toResponseDTO).toList();
	}

	@Override
	public UserResponseDTO updateUser(Long id, UpdateUserRequestDTO requestDTO) {

		User existingUser = userRepository.findById(id)
				.orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

		existingUser.setName(requestDTO.getName());
		existingUser.setPhone(requestDTO.getPhone());
		existingUser.setUpdatedAt(LocalDateTime.now());

		User updatedUser = userRepository.save(existingUser);

		saveAuditLog(getCurrentUserIdOrFallback(id), "UPDATE_USER", "USER:" + id);

		return UserMapper.toResponseDTO(updatedUser);
	}

	@Override
	public UserResponseDTO updateUserStatus(Long id, UpdateUserStatusRequestDTO requestDTO) {

		User existingUser = userRepository.findById(id)
				.orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

		existingUser.setStatus(requestDTO.getStatus());
		existingUser.setUpdatedAt(LocalDateTime.now());

		User updatedUser = userRepository.save(existingUser);

		saveAuditLog(getCurrentUserIdOrFallback(id), "UPDATE_USER_STATUS", "USER:" + id);

		return UserMapper.toResponseDTO(updatedUser);
	}

	private void saveAuditLog(Long userId, String action, String resource) {
		AuditLog auditLog = AuditLog.builder().userId(userId).action(action).resource(resource).build();

		auditLogService.saveAuditLog(auditLog);
	}

	private Long getCurrentUserIdOrFallback(Long fallbackUserId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication != null && authentication.isAuthenticated() && authentication.getName() != null
				&& !authentication.getName().equals("anonymousUser")) {

			return userRepository.findByEmail(authentication.getName()).map(User::getId).orElse(fallbackUserId);
		}

		return fallbackUserId;
	}
}
