package com.swp391.horseracing.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${app.mail.from:}")
    private String from;

    @Autowired
    private JavaMailSender mailSender;

    public boolean sendText(String to, String subject, String text) {
        if (!mailEnabled) {
            return false;
        }
        if (to == null || to.isBlank()) {
            return false;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (from != null && !from.isBlank()) {
                message.setFrom(from);
            }
            message.setTo(to);
            message.setSubject(subject == null ? "" : subject);
            message.setText(text == null ? "" : text);
            mailSender.send(message);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}
