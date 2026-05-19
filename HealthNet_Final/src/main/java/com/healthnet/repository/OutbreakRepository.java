package com.healthnet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.Outbreak;

public interface OutbreakRepository extends JpaRepository<Outbreak, Long> {

	List<Outbreak> findByDiseaseType(String diseaseType);

	List<Outbreak> findByLocation(String location);
}