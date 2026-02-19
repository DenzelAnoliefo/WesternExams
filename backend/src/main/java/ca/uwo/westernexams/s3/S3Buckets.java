package ca.uwo.westernexams.s3;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "aws.s3.buckets")
public class S3Buckets {

    private String exams;

    public String getExams() {
        return exams;
    }

    public void setExams(String exams) {
        this.exams = exams;
    }
}
