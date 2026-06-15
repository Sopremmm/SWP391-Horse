package com.swp391.horseracing.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            System.out.println("Email sent to: " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendInvitationEmail(String toEmail, String horseName, String raceName, String ownerName) {
        String subject = "New Race Invitation - Horse Racing";
        String text = String.format(
                "Dear Jockey,\n\n" +
                        "You have been invited by %s to ride horse '%s' in race '%s'.\n\n" +
                        "Please log in to the system to accept or decline this invitation.\n\n" +
                        "Best regards,\nHorse Racing Team",
                ownerName, horseName, raceName
        );
        sendSimpleEmail(toEmail, subject, text);
    }

    public void sendPredictionResultEmail(String toEmail, String horseName, String raceName, boolean isWin) {
        String subject = isWin ? "🎉 You WON the prediction!" : "Prediction Result";
        String text = String.format(
                "Dear Spectator,\n\n" +
                        "The race '%s' has been completed.\n" +
                        "Your prediction for horse '%s' was %s.\n\n" +
                        "Thank you for using Horse Racing System!\n\n" +
                        "Best regards,\nHorse Racing Team",
                raceName, horseName, isWin ? "CORRECT! You won!" : "incorrect. Better luck next time!"
        );
        sendSimpleEmail(toEmail, subject, text);
    }
}