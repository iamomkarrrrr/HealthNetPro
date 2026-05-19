package com.healthnet.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.Citizen;

public interface CitizenRepository extends JpaRepository<Citizen, Long> {

	boolean existsByUserId(Long userId);

	Optional<Citizen> findByUserId(Long userId);

	boolean existsByContactInfo(String contactInfo);
}
