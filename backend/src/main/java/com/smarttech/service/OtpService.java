package com.smarttech.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class OtpService {

    private Map<String, String> otpStorage = new HashMap<>();

    // Send OTP method
    public void sendOtp(String email, JavaMailSender mailSender) {
        // Generate 6-digit OTP
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
        otpStorage.put(email, otp);

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Smart Tech Account OTP");
        message.setText("Your OTP is: " + otp + "\nIt will expire in 5 minutes.");
        mailSender.send(message);
    }

    // Verify OTP method
    public boolean verifyOtp(String email, String otp) {
        String correctOtp = otpStorage.get(email);
        return correctOtp != null && correctOtp.equals(otp);
    }
}
