package com.healthnet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.DiseaseCase;

public interface DiseaseCaseRepository extends JpaRepository<DiseaseCase, Long> {

	List<DiseaseCase> findByCitizenId(Long citizenId);

	List<DiseaseCase> findByDoctorId(Long doctorId);
}