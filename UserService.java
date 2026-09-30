package com.example.UserAuthentication.service;

import com.example.UserAuthentication.Exception.UserAlreadyExistsException;
import com.example.UserAuthentication.Exception.UserNotFoundException;
import com.example.UserAuthentication.model.User;
import com.example.UserAuthentication.model.EmailData;

import java.util.List;

public interface UserService {

    List<User> FindUser();

    User addUser(User user) throws UserAlreadyExistsException;

    User updateUser(User user) throws UserNotFoundException;

    User loginCheck(String emailId,String password);

    public boolean emailExists(String userEmail);

    String sendEmail(EmailData emailData);

     String sendOtp(String email);

     boolean verifyOtp(String email, String otp);

    public User unsubscribeUser(String email, String paymentId) throws UserNotFoundException;

    public User subscribeUser(String email, String paymentId) throws UserNotFoundException;

    public User updatePassword(String email, String newPassword) throws UserNotFoundException;

    User findByEmail(String email);
}
