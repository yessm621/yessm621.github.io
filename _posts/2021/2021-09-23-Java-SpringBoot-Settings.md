---
title: "SpringBoot Settings"
categories:
  - Spring
tags:
  - Java
  - Spring
toc: true
toc_label: "Index"
toc_sticky: true
---

## 1. SpringBoot Settings

→ spring boot 기반으로 셋팅

[Spring Initializr](https://start.spring.io/)

 위의 사이트에서 기본적인 스프링 프로젝트 셋팅을 할 수 있다

설정 시 Dependencies 에서 

- spring web
- Thymeleaf
- spring data jpa
- h2 database
- lombok

를 선택 후 GENERATE!

<img width="1434" alt="스크린샷_2021-08-06_오전_10 17 06" src="https://user-images.githubusercontent.com/79130276/134440908-2194904c-d1df-44c1-a27c-805c6b27a325.png">

위에서 GENERATE 한 파일을 IntelliJ 에서 Open!

→ build.gradle 파일을 Open

<br>
<br>


## 2. IntelliJ Gradle 대신에 자바 직접 실행

IntelliJ 버전은 Gradle 로 실행하는 것이 기본 설정이지만, 이렇게 하면 실행속도가 느림. 따라서, 다음과 같이 변경하면 자바로 바로 실행해서 속도가 빠르다.

Preferences 에서 Gradle 을 검색하여 

- build and run using
- Run tests using

을 IntelliJ IDEA 로 바꿔준다


<br>
<br>


## 3. Lombok 설정

lombok 을 설정하고 나서 preferences 에서 annotation processors 를 설정해야 한다.

enable annotation processing 에 체크!


<br>
<br>


## 4. H2 데이터베이스 생성

1. h2 콘솔에 접속
2. 콘솔에서 아래와 같이 입력 후 연결을 누르면 jpapractice 라는 데이터베이스가 생성됨

	![Untitled](https://user-images.githubusercontent.com/79130276/134440900-daba78ce-738c-433e-8d6f-99cb947972e5.png)
	![Untitled2](https://user-images.githubusercontent.com/79130276/134440902-6d74f4db-23d4-4c1a-bc48-763f19a4005f.png)

	jpapractice.mv.db 파일이 생성됨

	![Untitled3](https://user-images.githubusercontent.com/79130276/134440904-5a23c10d-8d53-4811-9da2-d3eeb12056f9.png)

3. h2 데이터베이스 접속

    아래와 같이 jdbc url 을 변경한다.

	![Untitled4](https://user-images.githubusercontent.com/79130276/134440905-01c1101b-8b2d-47ce-a086-da45a1ca2e34.png)

<br>

참고) [H2 Database 설치, 서버 실행, 접속 방법 (Windows, MacOS)](https://atoz-develop.tistory.com/entry/H2-Database-%EC%84%A4%EC%B9%98-%EC%84%9C%EB%B2%84-%EC%8B%A4%ED%96%89-%EC%A0%91%EC%86%8D-%EB%B0%A9%EB%B2%95)


<br>
<br>


## 5. application.yml 작성

기존에 있던 application.properties 대신 `application.yml` 을 사용

(둘 중 하나 선택해서 사용하면 되는데 복잡해질 경우 yml 이 보기가 좋음)

application.yml

```yaml
spring:
  datasource:
    url: jdbc:h2:tcp://localhost/~/jpashop
    username: sa
    password:
    driver-class-name: org.h2.Driver

  jpa:
    hibernate:
      ddl-auto: create
    properties:
      hibernate:
#        show_sql: true
        format_sql: true

logging:
  level:
    org.hibernate.SQL: debug
#    org.hibernate.type: trace
```

- show_sql 과 org.hibernate.SQL 차이점

    공통점: 두가지 옵션 다 hibernate 실행 sql 로그를 찍는 기능을 한다. 

    차이점: show_sql 은 system.out 에 출력하는것이고 org.hibernate.SQL 은 logger 를 통해서 출력

    → 운영환경에서는 show_sql 을 사용하지 않는다.

    → 모든 로그 출력은 가급적 logger 를 통해 남기는게 좋다

- spring.jpa.hibernate.ddl-auto: create

    애플리케이션 생성 시점에 테이블을 drop 하고 다시 생성!


<br>
<br>


## 6. console 에 Query 파라미터 로그 남기기

스프링부트에서 기본적으로 제공하는 라이브러리가 없기 때문에 외부에서 가져와 사용

build.gradle 에 추가

```java
implementation 'com.github.gavlyukovskiy:p6spy-spring-boot-starter:1.5.6'
```

→ 개발단계에서는 편하지만 운영시스템에 적용하려면 성능테스트가 필요!
