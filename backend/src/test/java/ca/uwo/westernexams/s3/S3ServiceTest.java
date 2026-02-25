package ca.uwo.westernexams.s3;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.ByteArrayInputStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class S3ServiceTest {

    @Mock
    private S3Client s3Client;

    @InjectMocks
    private S3Service s3Service;

    @Test
    void putObject_callsS3ClientWithCorrectRequest() {
        byte[] fileBytes = "pdf-content".getBytes();

        s3Service.putObject("test-bucket", "exams/CS1027/test.pdf", fileBytes);

        ArgumentCaptor<PutObjectRequest> captor = ArgumentCaptor.forClass(PutObjectRequest.class);
        verify(s3Client).putObject(captor.capture(), any(RequestBody.class));

        PutObjectRequest request = captor.getValue();
        assertThat(request.bucket()).isEqualTo("test-bucket");
        assertThat(request.key()).isEqualTo("exams/CS1027/test.pdf");
        assertThat(request.contentType()).isEqualTo("application/pdf");
    }

    @Test
    void getObject_returnsBytes() throws Exception {
        byte[] expectedBytes = "pdf-content".getBytes();
        GetObjectResponse response = GetObjectResponse.builder().build();
        ResponseInputStream<GetObjectResponse> responseStream =
                new ResponseInputStream<>(response, new ByteArrayInputStream(expectedBytes));

        when(s3Client.getObject(any(GetObjectRequest.class))).thenReturn(responseStream);

        byte[] result = s3Service.getObject("test-bucket", "exams/CS1027/test.pdf");

        assertThat(result).isEqualTo(expectedBytes);

        ArgumentCaptor<GetObjectRequest> captor = ArgumentCaptor.forClass(GetObjectRequest.class);
        verify(s3Client).getObject(captor.capture());
        assertThat(captor.getValue().bucket()).isEqualTo("test-bucket");
        assertThat(captor.getValue().key()).isEqualTo("exams/CS1027/test.pdf");
    }

    @Test
    void deleteObject_callsS3ClientWithCorrectRequest() {
        s3Service.deleteObject("test-bucket", "exams/CS1027/test.pdf");

        ArgumentCaptor<DeleteObjectRequest> captor = ArgumentCaptor.forClass(DeleteObjectRequest.class);
        verify(s3Client).deleteObject(captor.capture());

        assertThat(captor.getValue().bucket()).isEqualTo("test-bucket");
        assertThat(captor.getValue().key()).isEqualTo("exams/CS1027/test.pdf");
    }
}
