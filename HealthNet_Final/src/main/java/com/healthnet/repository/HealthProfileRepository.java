package com.healthnet.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.HealthProfile;

public interface HealthProfileRepository extends JpaRepository<HealthProfile, Long> {

	Optional<HealthProfile> findByCitizenId(Long citizenId);
}