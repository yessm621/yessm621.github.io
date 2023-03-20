---
layout: post
title: "S3, 스프링 부트 구현"
date: 2023-03-20 14:00:00
categories: [AWS]
tags:
  - AWS
  - Spring
author: "유자"
---

앞선 포스트에서 AWS와 스프링 부트에서 S3를 사용하기 위한 설정을 하고 정상적으로 파일이 업로드 되는지 테스트를 진행했다. ([링크](https://yessm621.github.io/jpa/2023/03/20/AWS-S3-SpringBoot-Setting/))

이제 본격적으로 파일 관련 부분에 대해 구현해보자.

우선, 현재 문제점은 파일이 사용자가 설정한 이름 그대로 업로드 된다는 점이다. 파일을 업로드 할때는 UUID를 사용해서 파일의 이름이 중복되지 않도록 하는 것이 좋다. 또한, 패키지 별로 파일을 분리하는 것이 향후 규모가 큰  프로젝트 진행 시 도움이 될 것이다.

```java
package com.haedals.haedal.common;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class S3Uploader {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String uploadFiles(MultipartFile multipartFile, String dirName) throws IOException {
        File uploadFile = convert(multipartFile)
                .orElseThrow(() -> new IllegalArgumentException("error: MultipartFile -> File convert fail"));
        return upload(uploadFile, dirName);
    }

    public String upload(File uploadFile, String filePath) {
        String fileName = filePath + "/" + UUID.randomUUID() + uploadFile.getName();
        String uploadImageUrl = putS3(uploadFile, fileName);
        removeNewFile(uploadFile);
        return uploadImageUrl;
    }

    private String putS3(File uploadFile, String fileName) {
        amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, uploadFile).withCannedAcl(CannedAccessControlList.PublicRead));
        return amazonS3Client.getUrl(bucket, fileName).toString();
    }

    private void removeNewFile(File targetFile) {
        if (targetFile.delete()) {
            return;
        }
    }

    private Optional<File> convert(MultipartFile file) throws IOException {
        File convertFile = new File(System.getProperty("user.dir") + "/" + file.getOriginalFilename());
        if (convertFile.createNewFile()) {
            try (FileOutputStream fos = new FileOutputStream(convertFile)) {
                fos.write(file.getBytes());
            }
            return Optional.of(convertFile);
        }
        return Optional.empty();
    }
}
```

위의 코드를 통해서 파일 이름을 랜덤하게 만들고 원하는 폴더에 생성할 수 있게 된다.

```java
package com.haedals.haedal.file;

import com.haedals.haedal.common.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class FileController {

    private final S3Uploader s3Uploader;

    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String filePath = s3Uploader.uploadFiles(file, "product");
        return ResponseEntity.ok(filePath);
    }
}
```

여기서는 product로 폴더명을 하드코딩 하였다. 향후 실제 파일을 저장하는 로직을 구현할 때는 원하는 폴더명을 작성하면 된다.

이제 작성한 코드가 잘 되는지 테스트해보겠다. 마찬가지로 Postman을 통해 테스트 진행했다. 역시나 오류가 발생했다.(오류가 발생하지 않으면 불안하다.)  Access Denined 오류가 발생했는데 구글링 해보니 S3 설정 시 권한에서 모든 퍼블릭 액세스를 차단하면서 발생한 오류였다.

제일 위에 있는 권한은 체크 해제 후 다시 실행하니 파일이 잘 업로드 되는 것을 확인할 수 있었다.

![스크린샷 2023-03-20 오후 1.46.08.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/85286e23-569b-45e6-bedf-6170f3b92edf/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2023-03-20_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.46.08.png)

![스크린샷 2023-03-20 오후 1.41.33.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ebbb88fd-4f43-4ce5-b53d-c90d7ee24671/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2023-03-20_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.41.33.png)

![스크린샷 2023-03-20 오후 1.42.11.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a57f06b4-4d1d-447c-b0e7-2f279d86cc29/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2023-03-20_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.42.11.png)