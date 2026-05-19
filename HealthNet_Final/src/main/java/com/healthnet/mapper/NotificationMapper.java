package com.healthnet.mapper;

import com.healthnet.entity.Notification;
import com.healthnet.responsedto.NotificationResponseDTO;
import com.healthnet.resquestdto.CreateNotificationRequestDTO;

public class NotificationMapper {

	public static Notification toEntity(CreateNotificationRequestDTO requestDTO) {
		return Notification.builder().userId(requestDTO.getUserId()).entityId(requestDTO.getEntityId())
				.message(requestDTO.getMessage()).category(requestDTO.getCategory()).status(requestDTO.getStatus())
				.build();
	}

	public static NotificationResponseDTO toResponseDTO(Notification notification) {
		return NotificationResponseDTO.builder().id(notification.getId()).userId(notification.getUserId())
				.entityId(notification.getEntityId()).message(notification.getMessage())
				.category(notification.getCategory()).status(notification.getStatus())
				.createdDate(notification.getCreatedDate()).build();
	}
}