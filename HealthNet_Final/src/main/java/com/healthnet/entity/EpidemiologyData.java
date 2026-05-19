package com.healthnet.entity;

import java.time.LocalDate;

import com.healthnet.enums.EpidemiologyDataStatus;

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
@Table(name = "epidemiology_data")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EpidemiologyData {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long outbreakId;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String metricsJson;

	@Column(nullable = false)
	private LocalDate date;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private EpidemiologyDataStatus status;
}