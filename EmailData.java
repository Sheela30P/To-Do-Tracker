package com.example.UserAuthentication.model;



public class EmailData {
    private String receiver,messageBody,attachment,subject;

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getMessageBody() {
        return messageBody;
    }

    public void setMessageBody(String messageBody) {
        this.messageBody = messageBody;
    }

    public String getAttachment() {
        return attachment;
    }

    public void setAttachment(String attachment) {
        this.attachment = attachment;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public EmailData() {
    }

    public EmailData(String receiver, String messageBody,  String subject) {
        this.receiver = receiver;
        this.messageBody = messageBody;

        this.subject = subject;
    }
}
