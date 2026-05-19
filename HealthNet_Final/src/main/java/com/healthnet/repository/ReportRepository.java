package com.healthnet.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.Report;
import com.healthnet.enums.ReportScope;

public interface ReportRepository extends JpaRepository<Report, Long> {

	List<Report> findByScope(ReportScope scope);

	List<Report> findByGeneratedDate(LocalDate generatedDate);
}