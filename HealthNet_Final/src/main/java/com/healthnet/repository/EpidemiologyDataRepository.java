package com.healthnet.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.EpidemiologyData;

public interface EpidemiologyDataRepository extends JpaRepository<EpidemiologyData, Long> {

	List<EpidemiologyData> findByOutbreakId(Long outbreakId);

	List<EpidemiologyData> findByDate(LocalDate date);
}