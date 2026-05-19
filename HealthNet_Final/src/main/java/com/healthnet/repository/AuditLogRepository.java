package com.healthnet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

	List<AuditLog> findByUserId(Long userId);
}