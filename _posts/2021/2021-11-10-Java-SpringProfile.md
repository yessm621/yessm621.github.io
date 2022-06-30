---
title: "Spring Profile 이란?"
categories:
  - SpringBoot
tags:
  - Java
  - SpringBoot
toc: true
toc_label: "Index"
toc_sticky: true
---

개발환경에 따라 설정파일을 다르게 로딩해야할 필요가 있다

이처럼 Profile 은 **어떤 특정 환경의 설정 값을 다르게 하고 싶을 때** 사용

예를 들어, 테스트 환경과 배포 환경을 다르게 두고 Profile 설정

<br>

**기본적인 profile 정보**

- application.properties
- application.yml

<br>

여기서 특정 규칙에 만족하게 설정 파일을 만들면 SpringBoot 가 읽어올 수 있다.

- application-{프로필네임키워드}.properties
    - ex. application-dev.properties
- application-{프로필네임키워드}.yml
    - ex. application-prod.yml

<br>
<br>

### 실행하기

설정 정보를 바꿔서 실행하기 위한 방법으로 크게 2가지 방법을 사용

1. application.yml 에 profile.active 지정하기
2. java -jar 에 옵션을 줘서 특정 profile 로드하기

<br>

## 1. application.yml 에 profile.active 지정하기

yml 이나 properties 파일에서 직접 설정 정보를 변경, profile.active 를 지정하면 된다.

```yaml
---
spring:
  profiles:
    active: set1

---
spring:
  profiles:
    active: set2
```

만약, 아무것도 지정하지 않는다면 application.yml 또는 application.properties 파일을 불러오게 된다.

<br>

## 2. java -jar 에 옵션을 줘서 특정 profile 로드하기

java jar 파일로 빌드를 하고 jar 파일을 실행시키는 시점에 환경변수를 추가하여 profile 을 변경시킬 수 있다.

```bash
java -jar -Dspring.profiles.active=set1 ./cat-0.0.1-SNAPSHOT.jar

java -jar -Dspring.profiles.active=set2 ./cat-0.0.1-SNAPSHOT.jar
```

<br>

### 테스트

application.yml

```yaml
server:
  port: 8080

spring:
  application:
    name: user-service

  profiles:
    active: test # 만약 application-prod.yml 파일을 로딩하고 싶다면, prod

greeting:
  message: this is MAIN application.yml
```

application-test.yml

```yaml
greeting:
  message: this is TEST application.yml
```

application-prod.yml

```yaml
greeting:
  message: this is PRODUCTION application.yml
```

ProfileApplication.java

```java
@SpringBootApplication
@RestController
public class UserServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

    @GetMapping
    public String string(@Value("${greeting.message}") String message) {
        return message;
    }
}
```

<br>

profiles.active=test 일때, 아래 메시지 출력

```
this is TEST application.yml
```

profiles.active=prod 일때, 아래 메시지 출력

```
this is PRODUCTION application.yml
```

profiles.active 가 빈 값 일때, 아래 메시지 출력

```
this is MAIN application.yml
```

<br>

참고)

### java 에서 profile 옵션을 가져오고 싶을때?

→ **System.getProperty** 를 이용!

```java
// java -Dspring.profiles.active=set1 -jar ProfileApplication.jar 실행시
String profile = System.getProperty("spring.profiles.active"); // set1
```
