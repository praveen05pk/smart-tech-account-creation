package com.smarttech.model;

public class OtpDetails {
    private String otp;
    private long expiry;

    public OtpDetails(String otp, long expiry){
        this.otp = otp;
        this.expiry = expiry;
    }

    public String getOtp() { return otp; }
    public long getExpiry() { return expiry; }
}
