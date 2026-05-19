package com.healthnet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.VaccinationProgram;
import com.healthnet.enums.VaccinationProgramStatus;

public interface VaccinationProgramRepository extends JpaRepository<VaccinationProgram, Long> {

	List<VaccinationProgram> findByStatus(VaccinationProgramStatus status);

	List<VaccinationProgram> findByTitleContainingIgnoreCase(String title);
}