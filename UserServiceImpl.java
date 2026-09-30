package com.example.UserAuthentication.service;

import com.example.UserAuthentication.Exception.UserAlreadyExistsException;
import com.example.UserAuthentication.Exception.UserNotFoundException;
import com.example.UserAuthentication.model.User;
import com.example.UserAuthentication.repository.UserRespository;
import com.example.UserAuthentication.model.EmailData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRespository userRespository;// This will now correctly inject the PasswordEncoder bean

    @Override
    public List<User> FindUser() {
        return userRespository.findAll();
    }

    @Override
    public User addUser(User user) throws UserAlreadyExistsException {
        if(userRespository.existsByUserEmail(user.getUserEmail())){
            throw new UserAlreadyExistsException();
        }
        return userRespository.save(user);
    }

    @Override
    public User updateUser(User user) throws UserNotFoundException {
        if (userRespository.existsById(user.getUserEmail())) {
            User u = userRespository.findByUserEmail(user.getUserEmail());
            u.setUserName(user.getUserName());
            u.setMobileNo(user.getMobileNo());

            // Only update the profile image if it's not null or empty
            if (user.getProfileImageFileName() != null && !user.getProfileImageFileName().isEmpty()) {
                u.setProfileImageFileName(user.getProfileImageFileName());
            }

            return userRespository.save(u);
        }

        throw new UserNotFoundException();
    }

    @Override
    public User loginCheck(String emailId, String password) {
        return userRespository.findByUserEmailAndPassword(emailId,password);
    }
    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String sender;

    @Override
    public String sendEmail(EmailData emailData) {
        System.out.println(emailData);
        try {
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom(sender);
            simpleMailMessage.setTo(emailData.getReceiver());
            simpleMailMessage.setText(emailData.getMessageBody());
            simpleMailMessage.setSubject(emailData.getSubject());
            javaMailSender.send(simpleMailMessage);
            return "Mail sent to " + emailData.getReceiver();
        } catch (Exception e) {
            e.printStackTrace();
            return "sending mail failed";
        }
    }

    private HashMap<String, String> otpStorage = new HashMap<>(); // Temporary storage for OTPs

    public String sendOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        otpStorage.put(email, otp);
        String message = "Your OTP is: " + otp;
        EmailData emailData = new EmailData(email, message, "Email Verification");
        sendEmail(emailData);
        return "OTP sent to " + email;
    }

    public boolean verifyOtp(String email, String otp) {
        return otp.equals(otpStorage.get(email));
    }

    public boolean emailExists(String userEmail) {

        return userRespository.existsByUserEmail(userEmail);
    }

    public User subscribeUser(String email, String paymentId) throws UserNotFoundException {
        Optional<User> userOptional = Optional.ofNullable(userRespository.findByUserEmail(email));
        if (!userOptional.isPresent() && paymentId != null) {
            userOptional = Optional.ofNullable(userRespository.findByPaymentId(paymentId));
        }
        if (!userOptional.isPresent()) {
            throw new UserNotFoundException();
        }
        User user = userOptional.get();
        user.setSubscribed(true);
        return userRespository.save(user);
    }

    public User unsubscribeUser(String email, String paymentId) throws UserNotFoundException {
        Optional<User> userOptional = Optional.ofNullable(userRespository.findByUserEmail(email));
        if (!userOptional.isPresent() && paymentId != null) {
            userOptional = Optional.ofNullable(userRespository.findByPaymentId(paymentId));
        }
        if (!userOptional.isPresent()) {
            throw new UserNotFoundException();
        }
        User user = userOptional.get();
        user.setSubscribed(false);
        return userRespository.save(user);
    }

    public User updatePassword(String email, String newPassword) throws UserNotFoundException {
        if (userRespository.existsById(email)) {
            User user = userRespository.findByUserEmail(email);
            user.setPassword(newPassword); // You may want to hash the password here.
            return userRespository.save(user);
        }
        throw new UserNotFoundException();
    }

    public User findByEmail(String email){return userRespository.findByUserEmail(email);}


}
