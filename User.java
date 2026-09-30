package com.example.UserAuthentication.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity

public class User {

    @Id
    @Column(unique = true, nullable = false)
    private String userEmail;

    private String userName;

    private String mobileNo;

    private String password;
    private String status;
    private String profileImageFileName;
    private String paymentId;

    private boolean isSubscribed;


    public User() {
    }

    public User( String userName, String userEmail, String mobileNo, String password, String status,String profileImageFileName,String paymentId, boolean isSubscribed ) {

        this.userName = userName;
        this.userEmail = userEmail;
        this.mobileNo = mobileNo;
        this.password = password;
        this.status = status;
        this.profileImageFileName=profileImageFileName;
        this.paymentId=paymentId;
        this.isSubscribed=isSubscribed;

    }



    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getProfileImageFileName() {
        return profileImageFileName;
    }

    public void setProfileImageFileName(String profileImageFileName) {
        this.profileImageFileName = profileImageFileName;
    }

    public boolean isSubscribed() {
        return isSubscribed;
    }

    public void setSubscribed(boolean subscribed) {
        isSubscribed = subscribed;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    @Override
    public String toString() {
        return "User{" +

                ", userName='" + userName + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", mobileNo='" + mobileNo + '\'' +
                ", password='" + password + '\'' +
                ", status='" + status + '\'' +
                ", isSubscribed='" + isSubscribed + '\'' +
                '}';
    }
}
