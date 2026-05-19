package com.healthnet.entity;

import com.healthnet.enums.HealthProfileStatus;

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
@Table(name = "health_profiles")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HealthProfile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long citizenId;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String medicalHistory;

	@Column(nullable = false)
	private String allergies;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private HealthProfileStatus status;
}
