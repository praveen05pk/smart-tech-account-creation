package com.smarttech.controller;

import com.smarttech.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/send")
    public String sendOtp(@RequestParam String email) {
        String otp = otpService.generateOtp(email);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Smart Tech OTP Verification");
        message.setText("Your OTP is: " + otp + " (Valid for 5 minutes)");

        mailSender.send(message);
        return "OTP sent successfully";
    }

    @GetMapping("/verify")
    public String verifyOtp(@RequestParam String email,
                            @RequestParam String otp) {
        return otpService.validateOtp(email, otp)
                ? "OTP Verified Successfully"
                : "Invalid or Expired OTP";
    }
}
