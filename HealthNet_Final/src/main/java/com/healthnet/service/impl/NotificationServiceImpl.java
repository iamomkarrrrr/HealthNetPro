package com.healthnet.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.healthnet.email.service.EmailService;
import com.healthnet.entity.Notification;
import com.healthnet.entity.User;
import com.healthnet.enums.ImmunizationStatus;
import com.healthnet.enums.NotificationCategory;
import com.healthnet.enums.NotificationStatus;
import com.healthnet.enums.UserRole;
import com.healthnet.mapper.NotificationMapper;
import com.healthnet.repository.CitizenRepository;
import com.healthnet.repository.ImmunizationRepository;
import com.healthnet.repository.NotificationRepository;
import com.healthnet.repository.UserRepository;
import com.healthnet.responsedto.NotificationResponseDTO;
import com.healthnet.resquestdto.CreateNotificationRequestDTO;
import com.healthnet.resquestdto.UpdateNotificationStatusRequestDTO;
import com.healthnet.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService {

	private final NotificationRepository notificationRepository;
	private final EmailService emailService;
	private final UserRepository userRepository;
	private final CitizenRepository citizenRepository;
	private final ImmunizationRepository immunizationRepository;

	public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository,
			EmailService emailService, CitizenRepository citizenRepository,
			ImmunizationRepository immunizationRepository) {
		this.notificationRepository = notificationRepository;
		this.emailService = emailService;
		this.userRepository = userRepository;
		this.citizenRepository = citizenRepository;
		this.immunizationRepository = immunizationRepository;
	}

	@Override
	public NotificationResponseDTO createNotification(CreateNotificationRequestDTO requestDTO) {

		Notification notification = NotificationMapper.toEntity(requestDTO);

		Notification savedNotification = notificationRepository.save(notification);

		return NotificationMapper.toResponseDTO(savedNotification);
	}

	@Override
	public List<NotificationResponseDTO> getNotificationsByUserId(Long userId) {

		return notificationRepository.findByUserId(userId).stream().map(NotificationMapper::toResponseDTO).toList();
	}

	@Override
	public List<NotificationResponseDTO> getNotificationsByCategory(NotificationCategory category) {

		return notificationRepository.findByCategory(category).stream().map(NotificationMapper::toResponseDTO).toList();
	}

	@Override
	public NotificationResponseDTO updateNotificationStatus(Long id, UpdateNotificationStatusRequestDTO requestDTO) {

		Notification existingNotification = notificationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));

		existingNotification.setStatus(requestDTO.getStatus());

		Notification updatedNotification = notificationRepository.save(existingNotification);

		return NotificationMapper.toResponseDTO(updatedNotification);
	}

	@Override
	public void sendVaccinationCampaignNotifications(Long vaccinationProgramId, String campaignTitle,
			String vaccineType, String startDate) {

		List<User> citizenUsers = userRepository.findByRole(UserRole.CITIZEN);

		String dashboardMessage = "New vaccination campaign available: " + campaignTitle + " for " + vaccineType
				+ ". Starts on " + startDate + ".";

		for (User user : citizenUsers) {

			// 1. Dashboard notification for every citizen user
			Notification notification = Notification.builder().userId(user.getId()).entityId(vaccinationProgramId)
					.message(dashboardMessage).category(NotificationCategory.VACCINATION)
					.status(NotificationStatus.UNREAD).build();

			notificationRepository.save(notification);

			// 2. Email only if citizen profile exists and vaccine is not GIVEN
			citizenRepository.findByUserId(user.getId()).ifPresent(citizen -> {

				boolean alreadyGiven = immunizationRepository.existsByCitizenIdAndVaccineTypeIgnoreCaseAndStatus(
						citizen.getId(), vaccineType, ImmunizationStatus.GIVEN);

				if (!alreadyGiven) {
					emailService.sendVaccinationCampaignEmail(user.getEmail(), user.getName(), campaignTitle,
							vaccineType, startDate);
				}
			});
		}
	}
}