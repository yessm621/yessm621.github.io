---
title: "스프링부트 Settings"
categories: 
  - SpringBoot
tags:
  - SpringBoot
  - Java
toc: true
toc_sticky: true
---

## SpringBoot Settings

다음 [Spring Initializr(https://start.spring.io/)](https://start.spring.io/) 사이트에서 기본적인 스프링 프로젝트를 셋팅을 할 수 있다

설정 시 Add Dependencies에서 필요한 Dependency를 선택 후 GENERATE 버튼을 클릭하면 내게 필요한 라이브러리들을 build.gradle에 추가하여 스프링부트 프로젝트를 생성해준다.

<img width="1434" alt="스크린샷_2021-08-06_오전_10 17 06" src="https://user-images.githubusercontent.com/79130276/134440908-2194904c-d1df-44c1-a27c-805c6b27a325.png">

## IntelliJ Gradle 대신에 자바 직접 실행

IntelliJ 버전은 Gradle로 실행하는 것이 기본 설정이지만, 이렇게 하면 실행 속도가 느리다. 따라서, 다음과 같이 변경하면 자바로 바로 실행해서 속도가 빠르다.

Preferences에서 Gradle을 검색하여 아래 내용을 IntelliJ IDEA로 바꿔준다.

- build and run using
- Run tests using

## Lombok 설정

lombok을 설정하고 나서 preferences에서 annotation processors를 설정해야 한다.

enable annotation processing에 체크하자.

## H2 데이터베이스 생성

H2 데이터베이스를 선택했다면 아래와 같은 설정을 해야 한다.

1. h2 데이터베이스 설치
    - H2 데이터베이스 설치와 관련된 부분은 아래 블로그에 자세히 나와있으니 참고하자.
    
    - [H2 Database 설치, 서버 실행, 접속 방법 (Windows, MacOS)](https://atoz-develop.tistory.com/entry/H2-Database-%EC%84%A4%EC%B9%98-%EC%84%9C%EB%B2%84-%EC%8B%A4%ED%96%89-%EC%A0%91%EC%86%8D-%EB%B0%A9%EB%B2%95)
    
2. h2 데이터베이스 실행
    - 설치를 한 폴더로 가서 ./h2.sh 명령어로 실행한다.
    
    ![스크린샷 2023-09-18 오후 2 42 19](https://github.com/yessm621/yessm621.github.io/assets/79130276/c38d4aac-5cc6-43c4-8411-689109b568e8)
    
    - 실행하면 자동으로 localhost:8082 주소로 웹 페이지가 실행된다. 만약 제대로 실행되지 않으면 직접 실행하면 된다.
3. h2 콘솔에 접속, 데이터베이스 생성
    - localhost:8082로 접속하면 아래와 같은 화면이 보이는데 JDBC URL에 아래와 같이 입력하면 test라는 데이터베이스가 생성된다.
    
    ![스크린샷 2023-09-18 오후 2 45 36](https://github.com/yessm621/yessm621.github.io/assets/79130276/48318084-0186-4c01-be08-1e1b09ca0ab8)
    
4. h2 데이터베이스 접속
    - 연결된 DB를 해제하고 아래와 같이 JDBC URL을 변경하여 재연결하면 DB에 접속된다.
    
    ![스크린샷 2023-09-18 오후 2 47 47](https://github.com/yessm621/yessm621.github.io/assets/79130276/cba1de6a-ac08-4a74-8388-097e022b0545)
    
    ![스크린샷 2023-09-18 오후 2 50 18](https://github.com/yessm621/yessm621.github.io/assets/79130276/30520fae-d2d6-4bf4-8693-02af05724f8e)

## application.yml 작성

기존에 있던 application.properties 대신 application.yml을 사용한다.

(둘 중 하나 선택해서 사용하면 되는데 복잡해질 경우 yml이 보기가 좋다. 취향 것 선택하면 된다.)

application.yml

```yaml
spring:
  datasource:
    url: jdbc:h2:tcp://localhost/~/test
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

- show_sql과 org.hibernate.SQL 차이점

    - 공통점: 두가지 옵션 다 hibernate 실행 sql 로그를 찍는 기능을 한다. 

    - 차이점: show_sql은 system.out에 출력하는것이고 org.hibernate.SQL은 logger를 통해서 출력한다.

    → 운영환경에서는 show_sql을 사용하지 않고 모든 로그 출력은 가급적 logger를 통해 남기는게 좋다.

- spring.jpa.hibernate.ddl-auto: create

    애플리케이션 생성 시점에 테이블을 drop하고 다시 생성한다. `실무에서는 사용하면 안된다.`

## console에 Query 파라미터 로그 남기기

스프링부트에서 기본적으로 제공하는 라이브러리가 없기 때문에 외부에서 가져와 사용한다.

build.gradle에 추가

```java
implementation 'com.github.gavlyukovskiy:p6spy-spring-boot-starter:1.5.6'
```

이 라이브러리는 개발단계에서는 편하지만 운영시스템에 적용하려면 성능테스트가 필요하다.

## Reference.

[H2 Database 설치, 서버 실행, 접속 방법 (Windows, MacOS)](https://atoz-develop.tistory.com/entry/H2-Database-%EC%84%A4%EC%B9%98-%EC%84%9C%EB%B2%84-%EC%8B%A4%ED%96%89-%EC%A0%91%EC%86%8D-%EB%B0%A9%EB%B2%95)