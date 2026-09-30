package com.example.UserAuthentication.Exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT,reason = "This User is Already Exists")
public class UserAlreadyExistsException extends Exception{
}
