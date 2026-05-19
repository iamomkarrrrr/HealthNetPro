package com.healthnet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.Immunization;
import com.healthnet.enums.ImmunizationStatus;

public interface ImmunizationRepository extends JpaRepository<Immunization, Long> {

	List<Immunization> findByCitizenId(Long citizenId);

	List<Immunization> findByVaccineType(String vaccineType);

	boolean existsByCitizenIdAndVaccineTypeIgnoreCaseAndStatus(Long citizenId, String vaccineType,
			ImmunizationStatus status);
}