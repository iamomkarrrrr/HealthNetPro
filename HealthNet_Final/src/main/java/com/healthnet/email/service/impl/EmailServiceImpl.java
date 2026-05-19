package com.healthnet.email.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.healthnet.email.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

	private final JavaMailSender javaMailSender;

	@Value("${mail.from}")
	private String fromEmail;

	public EmailServiceImpl(JavaMailSender javaMailSender) {
		this.javaMailSender = javaMailSender;
	}

	@Override
	public void sendVaccinationCampaignEmail(String to, String citizenName, String campaignTitle, String vaccineType,
			String startDate) {

		String subject = "HealthNet Vaccination Campaign - " + vaccineType;

		String body = "Hello " + citizenName + "," + "\n\nA new vaccination campaign is available for you."
				+ "\n\nCampaign: " + campaignTitle + "\nVaccine Type: " + vaccineType + "\nStart Date: " + startDate
				+ "\n\nOur records show that you have not yet taken this immunization."
				+ "\nPlease visit your HealthNet dashboard for more details." + "\n\nRegards,\nHealthNet Team";

		sendSimpleEmail(to, subject, body);
	}

	@Override
	public void sendSimpleEmail(String to, String subject, String body) {
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setFrom(fromEmail);
		mailMessage.setTo(to);
		mailMessage.setSubject(subject);
		mailMessage.setText(body);

		javaMailSender.send(mailMessage);
	}

	@Override
	public void sendOtpEmail(String to, String otp) {
		String subject = "HealthNet Password Reset OTP";
		String body = "Your password reset OTP is: " + otp + "\n\nThis OTP is valid for 5 minutes."
				+ "\nIf you did not request this, please ignore this email.";

		sendSimpleEmail(to, subject, body);
	}

	@Override
	public void sendRegistrationEmail(String to, String name) {
		String subject = "Welcome to HealthNet";
		String body = "Hello " + name + "," + "\n\nYour HealthNet account has been created successfully."
				+ "\nYou can now log in and access the system." + "\n\nRegards,\nHealthNet Team";

		sendSimpleEmail(to, subject, body);
	}

	@Override
	public void sendNotificationEmail(String to, String message, String category) {
		String subject = "HealthNet Alert - " + category;
		String body = "You have received a new HealthNet notification:" + "\n\n" + message
				+ "\n\nRegards,\nHealthNet Team";

		sendSimpleEmail(to, subject, body);
	}
}