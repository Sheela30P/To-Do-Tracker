package com.example.UserAuthentication.Exception;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT,reason = "User is not Authorized")
public class UserNotAuthorizedException extends Exception{
}
