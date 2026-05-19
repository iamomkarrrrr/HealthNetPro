package com.healthnet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.CitizenDocument;

public interface CitizenDocumentRepository extends JpaRepository<CitizenDocument, Long> {

	List<CitizenDocument> findByCitizenId(Long citizenId);
}