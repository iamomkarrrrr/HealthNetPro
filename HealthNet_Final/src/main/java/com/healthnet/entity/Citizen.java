package com.healthnet.entity;

import java.time.LocalDate;

import com.healthnet.enums.CitizenStatus;

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
@Table(name = "citizens")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Citizen {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private Long userId;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private LocalDate dob;

	@Column(nullable = false)
	private String gender;

	@Column(nullable = false)
	private String address;

	@Column(nullable = false, unique = true)
	private String contactInfo;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private CitizenStatus status;
}