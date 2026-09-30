package com.example.UserAuthentication.service;

import com.example.UserAuthentication.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class GenerateJwtImpl implements GenerateJwt{
    @Override
    public Map<String, String> genrateToken(User user) {
        Map<String,String> result=new HashMap<>();

        Map<String,Object>  claims=new HashMap<>();

        claims.put("ThisUserEmail",user.getUserEmail());
        claims.put("ThisUserName",user.getUserName());
        claims.put("ThisMobileNumber",user.getMobileNo());
        claims.put("ThisPassword",user.getPassword());
        claims.put("ThisUserImage",user.getProfileImageFileName());
        claims.put("ThisIsSubscribed",user.isSubscribed());

        String jwt= Jwts.builder()
                .setClaims(claims)
                .setSubject("token")
                .setIssuer("authenication app")
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256,"cool")
                .compact();
        result.put("token",jwt);
        result.put("message","Login Success");

        return result;
    }
}
