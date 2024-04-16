---
title: "AWS S3 생성, Spring Boot와 연동"
categories:
  - DevOps
tags:
  - AWS
  - SpringBoot
toc: true
toc_sticky: true
---

스프링 부트에서 AWS S3를 사용하기 위한 과정을 작성하였다.

과정은 다음과 같다.

1. S3 버킷을 생성하고 AccessKey와 SecretKey를 발급받는다.
2. 발급받은 AccessKey와 SecretKey를 통해 Spring Boot 에서 S3에 접근 가능하도록 한다.

## S3 생성

![스크린샷 2024-03-26 오후 4 49 51](https://github.com/yessm621/yessm621.github.io/assets/79130276/7e47556b-15f8-40ac-9711-df3bfaf4961a)

![스크린샷 2024-03-26 오후 4 50 50](https://github.com/yessm621/yessm621.github.io/assets/79130276/e7e71e28-9b42-4336-aadb-44c53d6d518d)

![스크린샷 2024-03-26 오후 4 50 56](https://github.com/yessm621/yessm621.github.io/assets/79130276/5ac2d1a4-c09d-4400-b0f2-16b1e66b9ee3)

## IAM 생성

![스크린샷 2024-03-26 오후 4 52 10](https://github.com/yessm621/yessm621.github.io/assets/79130276/a7629f4d-3a9e-406f-9467-75e29bd1e107)

![스크린샷 2024-03-26 오후 4 52 30](https://github.com/yessm621/yessm621.github.io/assets/79130276/eae95be9-9a95-4c89-8e19-e349a8fe7195)

## IAM AccessKey, SecretKey

IAM → 사용자 → 보안 자격 증명 → 액세스 키 만들기

![스크린샷 2024-03-26 오후 5 06 22](https://github.com/yessm621/yessm621.github.io/assets/79130276/b9a07aa7-9af5-4a40-84f9-fc2779ad9c1b)

![스크린샷 2024-03-26 오후 5 07 42](https://github.com/yessm621/yessm621.github.io/assets/79130276/7449e957-06e8-42a5-bd24-f2f04555e6de)

![스크린샷 2024-03-26 오후 5 07 56](https://github.com/yessm621/yessm621.github.io/assets/79130276/6c56bfe9-ad55-488a-82fa-e9fc1b7878d3)

![스크린샷 2024-03-26 오후 5 08 28](https://github.com/yessm621/yessm621.github.io/assets/79130276/9238096e-5457-40cc-b134-6e97c9a4370d)

발급받은 accessKey와 secretKey는 잘 저장해둔다.

이제 스프링 부트에서 S3로 접근하는 코드를 작성해보자.

## Spring Boot, S3 이미지 업로드

### gradle.build

```
implementation 'org.springframework.cloud:spring-cloud-starter-aws:2.2.6.RELEASE'
```

### application.yml

```yaml
cloud:
  aws:
    credentials:
      accessKey: 발급받은 accessKey 값
      secretKey: 발급받은 secretKey 값
    s3:
      bucketName: s3 버킷 이름
    region:
      static: aws 지역 이름
    stack:
      auto: false
```

### S3 Config

```java
@Configuration
public class S3Config {

    @Value("${cloud.aws.credentials.accessKey}")
    private String accessKey;
    @Value("${cloud.aws.credentials.secretKey}")
    private String secretKey;
    @Value("${cloud.aws.region.static}")
    private String region;

    @Bean
    public AmazonS3 amazonS3() {
        AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);

        return AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region)
                .build();
    }
}
```

### S3 Service

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class S3ImageService {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucketName}")
    private String bucketName;

    public String upload(MultipartFile image) {
        if (image.isEmpty() || Objects.isNull(image.getOriginalFilename())) {
            throw new PinterestException("S3 에러, 파일이 없습니다.");
        }
        return this.uploadImage(image);
    }

    private String uploadImage(MultipartFile image) {
        this.validateImageFileExtension(image.getOriginalFilename());
        try {
            return this.uploadImageToS3(image);
        } catch (IOException e) {
            throw new PinterestException("S3 에러, 이미지 업로드 시 에러가 발생하였습니다.");
        }
    }

    private void validateImageFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf(".");
        if (lastDotIndex == -1) {
            throw new PinterestException("S3 에러, 파일 형식이 잘못되었습니다.");
        }

        String extension = filename.substring(lastDotIndex + 1).toLowerCase();
        List<String> allowedExtensionList = Arrays.asList("jpg", "jpeg", "png", "gif");

        if (!allowedExtensionList.contains(extension)) {
            throw new PinterestException("S3 에러, 파일 형식은 jpg, jpeg, png, gif 이어야 합니다.");
        }
    }

    private String uploadImageToS3(MultipartFile image) throws IOException {
        String originalFilename = image.getOriginalFilename(); //원본 파일 명
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")); //확장자 명

        String s3FileName = UUID.randomUUID().toString().substring(0, 10) + originalFilename; //변경된 파일 명

        InputStream is = image.getInputStream();
        byte[] bytes = IOUtils.toByteArray(is);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType("image/" + extension);
        metadata.setContentLength(bytes.length);
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);

        try {
            PutObjectRequest putObjectRequest =
                    new PutObjectRequest(bucketName, s3FileName, byteArrayInputStream, metadata)
                            .withCannedAcl(CannedAccessControlList.PublicRead);
            amazonS3.putObject(putObjectRequest); // put image to S3
        } catch (Exception e) {
            throw new PinterestException("S3 파일 에러가 발생하였습니다.");
        } finally {
            byteArrayInputStream.close();
            is.close();
        }

        return amazonS3.getUrl(bucketName, s3FileName).toString();
    }

    public void deleteImage(String imageAddress) {
        String key = getKeyFromImageAddress(imageAddress);
        try {
            amazonS3.deleteObject(new DeleteObjectRequest(bucketName, key));
        } catch (Exception e) {
            throw new PinterestException("S3 에러, 이미지 삭제 시 오류가 발생하였습니다.");
        }
    }

    private String getKeyFromImageAddress(String imageAddress) {
        try {
            URL url = new URL(imageAddress);
            String decodingKey = URLDecoder.decode(url.getPath(), "UTF-8");
            return decodingKey.substring(1); // 맨 앞의 '/' 제거
        } catch (MalformedURLException | UnsupportedEncodingException e) {
            throw new PinterestException("S3 파일 에러가 발생하였습니다.");
        }
    }
}
```

### S3 Controller

```java
@Controller
@RequiredArgsConstructor
public class FileController {

    private final S3ImageService s3ImageService;

    @PostMapping("/s3/upload")
    public ResponseEntity<?> s3Upload(@RequestPart(value = "image", required = false) MultipartFile image){
        String profileImage = s3ImageService.upload(image);
        return ResponseEntity.ok(profileImage);
    }

    @GetMapping("/s3/delete")
    public ResponseEntity<?> s3delete(@RequestParam String addr){
        s3ImageService.deleteImageFromS3(addr);
        return ResponseEntity.ok(null);
    }
}

```