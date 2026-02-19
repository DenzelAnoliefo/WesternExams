package ca.uwo.westernexams;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class WesternExamsApplication {

    public static void main(String[] args) {
        SpringApplication.run(WesternExamsApplication.class, args);
    }
}
