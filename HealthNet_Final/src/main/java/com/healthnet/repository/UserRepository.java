package com.healthnet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthnet.entity.User;
import com.healthnet.enums.UserRole;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	Optional<User> findByPhone(String phone);

	boolean existsByEmail(String email);

	boolean existsByPhone(String phone);

	List<User> findByRole(UserRole role);
}