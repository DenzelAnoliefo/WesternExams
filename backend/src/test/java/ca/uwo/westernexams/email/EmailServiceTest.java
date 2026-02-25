package ca.uwo.westernexams.email;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(mailSender);
        ReflectionTestUtils.setField(emailService, "fromEmail", "test@example.com");
    }

    @Test
    void sendWelcomeEmail_sendsMessageWithCorrectFields() {
        emailService.sendWelcomeEmail("user@uwo.ca", "John");

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage message = captor.getValue();
        assertThat(message.getTo()).containsExactly("user@uwo.ca");
        assertThat(message.getSubject()).contains("Welcome");
        assertThat(message.getText()).contains("John");
        assertThat(message.getFrom()).isEqualTo("test@example.com");
    }

    @Test
    void sendWelcomeEmail_whenMailSenderThrows_doesNotPropagate() {
        doThrow(new MailSendException("SMTP error")).when(mailSender).send(any(SimpleMailMessage.class));

        assertThatCode(() -> emailService.sendWelcomeEmail("user@uwo.ca", "John"))
                .doesNotThrowAnyException();
    }
}
