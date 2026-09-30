package com.example.UserAuthentication.service;

import com.example.UserAuthentication.model.User;

import java.util.Map;

public interface GenerateJwt {

    public abstract Map<String,String> genrateToken(User user);
}
