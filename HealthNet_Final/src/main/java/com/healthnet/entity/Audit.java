package com.healthnet.entity;

import java.time.LocalDate;

import com.healthnet.enums.AuditStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "audits")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Audit {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id; // AuditID

	@Column(nullable = false)
	private Long officerId; // OfficerID (IAM user)

	@Column(nullable = false)
	private String scope; // Audit scope (Case / Outbreak / Vaccination / System)

	@Column(nullable = false, columnDefinition = "TEXT")
	private String findings;

	@Column(nullable = false)
	private LocalDate date;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private AuditStatus status;
}