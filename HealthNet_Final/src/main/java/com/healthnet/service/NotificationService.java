package com.healthnet.service;

import java.util.List;

import com.healthnet.enums.NotificationCategory;
import com.healthnet.responsedto.NotificationResponseDTO;
import com.healthnet.resquestdto.CreateNotificationRequestDTO;
import com.healthnet.resquestdto.UpdateNotificationStatusRequestDTO;

public interface NotificationService {

	NotificationResponseDTO createNotification(CreateNotificationRequestDTO requestDTO);

	List<NotificationResponseDTO> getNotificationsByUserId(Long userId);

	List<NotificationResponseDTO> getNotificationsByCategory(NotificationCategory category);

	NotificationResponseDTO updateNotificationStatus(Long id, UpdateNotificationStatusRequestDTO requestDTO);

	void sendVaccinationCampaignNotifications(Long vaccinationProgramId, String campaignTitle, String vaccineType,
			String startDate);
}