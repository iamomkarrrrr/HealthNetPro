package com.healthnet.email.service;

public interface EmailService {

	void sendSimpleEmail(String to, String subject, String body);

	void sendOtpEmail(String to, String otp);

	void sendRegistrationEmail(String to, String name);

	void sendNotificationEmail(String to, String message, String category);

	void sendVaccinationCampaignEmail(String to, String citizenName, String campaignTitle, String vaccineType,
			String startDate);
}