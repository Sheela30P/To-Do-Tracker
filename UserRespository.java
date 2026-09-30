package com.example.UserAuthentication.repository;

import com.example.UserAuthentication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRespository extends JpaRepository<User,String> {

    boolean existsByUserEmail(String userEmail);
    User findByUserEmail(String emailId);
    User findByUserEmailAndPassword(String email,String password);
    User findByPaymentId(String paymentId);  // Find by paymentId

}

