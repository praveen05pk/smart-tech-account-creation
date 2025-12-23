package com.smarttech.controller;

import com.smarttech.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/send-otp")
    public String sendOtp(@RequestParam String email) {
        otpService.sendOtp(email, mailSender);
        return "OTP sent successfully";
    }

    @GetMapping("/verify-otp")
    public String verifyOtp(@RequestParam String email,
                            @RequestParam String otp) {
        return otpService.verifyOtp(email, otp)
                ? "OTP verified successfully"
                : "Invalid or expired OTP";
    }
}
