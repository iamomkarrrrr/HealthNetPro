package com.healthnet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.Notification;
import com.healthnet.enums.NotificationCategory;
import com.healthnet.enums.NotificationStatus;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	List<Notification> findByUserId(Long userId);

	List<Notification> findByCategory(NotificationCategory category);

	List<Notification> findByStatus(NotificationStatus status);

	List<Notification> findByUserIdAndStatus(Long userId, NotificationStatus status);
}