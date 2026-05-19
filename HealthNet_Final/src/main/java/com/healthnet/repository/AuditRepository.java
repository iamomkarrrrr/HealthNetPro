package com.healthnet.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.Audit;
import com.healthnet.enums.AuditStatus;

public interface AuditRepository extends JpaRepository<Audit, Long> {

	List<Audit> findByOfficerId(Long officerId);

	List<Audit> findByStatus(AuditStatus status);

	List<Audit> findByDate(LocalDate date);
}