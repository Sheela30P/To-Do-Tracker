package com.example.UserAuthentication.model;

public class Message {
   private String info;
   private String message;

    public Message() {
    }

    public Message(String info, String message) {
        this.info = info;
        this.message = message;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "Message{" +
                "info='" + info + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
}
