---
layout: post
title: "S3를 사용하기 위한 AWS, 스프링 부트 설정"
date: 2023-03-20 11:00:00
categories: [AWS]
tags:
  - AWS
  - Spring
author: "유자"
---

## AWS 설정

[https://gaeggu.tistory.com/33](https://gaeggu.tistory.com/33) 이 사이트를 참고하여 AWS 설정을 진행하였다.

### AWS 설정 과정

1. S3를 생성
2. IAM에 사용자 추가
3. S3에 접근하기 위해 IAM에서 생성한 사용자에게 권한을 부여
4. 엑세스 키를 생성
5. 사용자는 S3에 접근하기 위해 엑세스 키, 엑세스 시크릿 키를 사용한다.

> **참고** 키 생성 후에는 csv 파일로 다운로드 받는게 좋다.
> 

## SpringBoot S3 설정

**build.gradle**

```
implementation 'org.springframework.cloud:spring-cloud-starter-aws:2.2.6.RELEASE'
```

**application.yml**

```yaml
cloud:
  aws:
    s3:
      bucket: 
    stack.auto: false
    region.static: ap-northeast-2
    credentials:
      access-key: 
      secret-key: 
```

- cloud.aws.s3.bucket: s3에서 설정한 버킷 이름
- cloud.aws.region.static: 지역을 한국으로 고정
- cloud.aws.credentials.access-key: 액세스 키
- cloud.aws.credentials.secret-key: 액세스 시크릿 키

```java
package com.haedals.haedal.common;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;
    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;
    @Value("${cloud.aws.region.static}")
    private String region;

    @Bean
    public AmazonS3Client amazonS3Client() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
        return (AmazonS3Client) AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();
    }
}
```

여기까지 하면 스프링부트에서 S3를 사용하기 위한 기본적인 설정이 끝난다.

### File Upload 테스트

이제 파일이 정상적으로 S3에 업로드 되는지 테스트 해보자.

```java
package com.haedals.haedal.file;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        System.out.println("FileUploadController.uploadFile");
        try {
            String fileName = file.getOriginalFilename();
            String fileUrl = "https://" + bucket + "/test" + fileName;
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            amazonS3Client.putObject(bucket, fileName, file.getInputStream(), metadata);
            System.out.println("fileUrl = " + fileUrl);
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
```

Postman으로 테스트 시 파일이 업로드 된 것을 확인할 수 있다.

![스크린샷 2023-03-20 오전 10 48 11](https://user-images.githubusercontent.com/79130276/226229328-165e416e-71b8-4fd6-9127-9b38e8d91a71.png)

![스크린샷 2023-03-20 오전 10 48 39](https://user-images.githubusercontent.com/79130276/226229337-a5a1e277-2e36-4675-a0f8-abc3fd7cf00f.png)