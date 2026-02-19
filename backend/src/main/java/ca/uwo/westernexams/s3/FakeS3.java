package ca.uwo.westernexams.s3;

import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

public class FakeS3 implements S3Client {

    private static final String PATH =
            System.getProperty("user.home") + "/.westernexams/s3";

    @Override
    public String serviceName() {
        return "fake";
    }

    @Override
    public void close() {
    }

    @Override
    public PutObjectResponse putObject(PutObjectRequest putObjectRequest,
                                       RequestBody requestBody)
            throws AwsServiceException, SdkClientException {
        InputStream inputStream = requestBody.contentStreamProvider().newStream();

        try {
            byte[] bytes = inputStream.readAllBytes();
            Path filePath = Path.of(
                    buildObjectFullPath(
                            putObjectRequest.bucket(),
                            putObjectRequest.key()));
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, bytes);
            return PutObjectResponse.builder().build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ResponseInputStream<GetObjectResponse> getObject(
            GetObjectRequest getObjectRequest)
            throws AwsServiceException, SdkClientException {
        try {
            FileInputStream fileInputStream = new FileInputStream(
                    buildObjectFullPath(
                            getObjectRequest.bucket(),
                            getObjectRequest.key()));
            return new ResponseInputStream<>(
                    GetObjectResponse.builder().build(),
                    fileInputStream);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public DeleteObjectResponse deleteObject(DeleteObjectRequest deleteObjectRequest)
            throws AwsServiceException, SdkClientException {
        try {
            Path filePath = Path.of(
                    buildObjectFullPath(
                            deleteObjectRequest.bucket(),
                            deleteObjectRequest.key()));
            Files.deleteIfExists(filePath);
            return DeleteObjectResponse.builder().build();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildObjectFullPath(String bucketName, String key) {
        return PATH + "/" + bucketName + "/" + key;
    }
}
