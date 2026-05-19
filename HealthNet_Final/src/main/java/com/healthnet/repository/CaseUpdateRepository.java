package com.healthnet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.CaseUpdate;

public interface CaseUpdateRepository extends JpaRepository<CaseUpdate, Long> {

	List<CaseUpdate> findByCaseId(Long caseId);

	List<CaseUpdate> findByDoctorId(Long doctorId);
}