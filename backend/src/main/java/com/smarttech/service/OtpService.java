package com.smarttech.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    private final Map<String, OtpData> otpStore = new HashMap<>();
    private static final int EXPIRY_MINUTES = 5;

    public String generateOtp(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        otpStore.put(email, new OtpData(otp, LocalDateTime.now()));
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        OtpData data = otpStore.get(email);
        if (data == null) return false;

        if (data.time.plusMinutes(EXPIRY_MINUTES).isBefore(LocalDateTime.now())) {
            otpStore.remove(email);
            return false;
        }

        return data.otp.equals(otp);
    }

    static class OtpData {
        String otp;
        LocalDateTime time;

        OtpData(String otp, LocalDateTime time) {
            this.otp = otp;
            this.time = time;
        }
    }
}
