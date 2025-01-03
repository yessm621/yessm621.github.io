---
title: "Spring Security 일반 로그인 + 소셜 로그인(Security6.x, RestAPI)"
categories:
  - Spring
tags:
  - RestAPI
toc: true
toc_sticky: true
---
## 개요

Spring Security6.x 버전을 사용해서 일반 로그인과 OAuth2를 사용하는 소셜 로그인을 구현해보았다. RestAPI 형식으로 개발하였다. JWT는 0.12.3 버전을 사용한다. 응답값에 대한 결과도 공통 응답 형식을 구현하였다.

## 동작 원리

일반 로그인과 소셜 로그인의 동작 원리를 알아보자.

### 일반 로그인 동작 원리

![1](https://github.com/user-attachments/assets/4165c689-6109-47e3-baed-5b6e797f4a1d)

- 회원가입
- 로그인 (인증): 로그인 요청을 받은 후 JWT 토큰을 생성하여 응답한다.
    - UsernamePasswordAuthenticationFilter를 통해 회원을 검증하는 로직을 작성한다.
    - AuthenticationManager 내부에 아이디와 비밀번호를 넘겨 로그인 검증을 진행한다.
    - SuccessfulAuth 메서드를 통해서 로그인이 성공하면 JWT 토큰을 만들어 응답한다.
- 경로 접근 (인가): Jwt Filter를 통해 요청의 헤더에서 JWT를 찾아 검증을 하고 일시적 요청에 대한 Session을 생성한다. (생성된 세션은 요청이 끝나면 소멸됨)
    - JWT Token을 클라이언트가 보내면 JWT Filter에서 토큰을 검증한다.
    - 검증에 성공시 SecurityContextHolder Session에서 임의의 세션을 만든다.
    - 만들어진 세션은 인가 작업이 필요한 경로에 접근할 때 사용된다.

### 소셜 로그인 동작 원리 (OAuth2 로그인)

![2](https://github.com/user-attachments/assets/2b8e6d85-3652-4b64-b497-3d861b69c07b)

- 소셜 로그인 시도
    - OAuth2AuthorizationRequestRedirectFilter: 아래와 같은 주소로 요청이 오면 해당 필터가 요청을 잡아 처리한다.
        
        ```
        /oauth2/authorization/서비스명
        
        /oauth2/authorization/naver
        /oauth2/authorization/google
        ```
        
    - 인증 서버에서 로그인이 성공하면 미리 설정해놓은 경로로 Code와 함께 리다이렉트 한다.
- 로그인 성공 리다이렉트
    - OAuth2LoginAuthenticationFilter: 외부 인증 서버에 설정할 redirect_uri, 아래와 같은 주소로 요청이 오면 해당 필터가 요청을 잡아 처리한다.
        
        ```
        /login/oauth2/code/서비스명
        
        /login/oauth2/code/naver
        /login/oauth2/code/google
        ```
        
    - OAuth2LoginAuthenticationProvider에 의해서 Code를 꺼낸다. Code로 Access Token을 발급 받고 Access Token으로 사용자 정보를 획득한다.
    - 획득한 사용자 정보를 OAuth2User에 담아 로그인을 진행하게 된다.
    - 로그인에 성공하게 되면 로그인 핸들러가 동작하게 되는데 그때 JWT를 발급해서 클라이언트에 보내준다.
- JWTFilter: JWT가 유효한지 검증

.

.

아래 그림은 모든 책임을 백엔드가 맡을 경우의 흐름이다. (우리가 구현할 백엔드의 흐름이다.)

![3](https://github.com/user-attachments/assets/1c767ba1-5784-4495-bbbe-2b0d577da5f0)

- 프론트가 백엔드에게 하이퍼링크로 요청한다. (예. http://localhost:8080/oauth2/authorization/naver)
- 백엔드에서 로그인 요청 로직 → Code 발급 → Code로 토큰 요청 → 토큰 발급 → 토큰으로 유저 요청 → 사용자 정보 발급 → 사용자 정보 확인 후 JWT 발급
- 발급한 JWT를 프론트로 전달
    - JWT 토큰은 Access Token과 Refresh Token을 발급하며 Refresh Token은 Access Token을 재발급하기 위한 용도로 사용된다.
    - Access Token과 Refresh Token의 저장 위치는 다음과 같다.
        - Access Token: 로컬 스토리지
        - Refresh Token: 쿠키

## 프로젝트 환경

### 버전 및 의존성

- Spring Boot 3.2.11
- Security 6.2.7
- JWT 0.12.3
- OAuth2 Client
- Lombok
- Spring Data JPA - MariaDB (Docker 사용)
- IntelliJ Ultimate

DB의 경우 Docker를 이용해 MariaDB를 사용했다. 관련 내용은 다음 [링크](https://yessm621.github.io/architecture/DockerEx/)를 참고하면 된다.

### build.gradle 의존성 추가

```
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-security'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
	runtimeOnly 'org.mariadb.jdbc:mariadb-java-client'

	dependencies {
		implementation 'io.jsonwebtoken:jjwt-api:0.12.3'
		implementation 'io.jsonwebtoken:jjwt-impl:0.12.3'
		implementation 'io.jsonwebtoken:jjwt-jackson:0.12.3'
	}

	compileOnly 'org.projectlombok:lombok'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testImplementation 'org.springframework.security:spring-security-test'
	testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}
```

### application.properties

```
spring.application.name=security
spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
spring.datasource.url=jdbc:mariadb://localhost:3306/database이름?useSSL=false&useUnicode=true&serverTimezone=Asia/Seoul
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=create
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

spring.jwt.secret=

#naver registration
spring.security.oauth2.client.registration.naver.client-name=naver
spring.security.oauth2.client.registration.naver.client-id=
spring.security.oauth2.client.registration.naver.client-secret=
spring.security.oauth2.client.registration.naver.redirect-uri=http://localhost:8080/login/oauth2/code/naver
spring.security.oauth2.client.registration.naver.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.naver.scope=name,email

#naver provider
spring.security.oauth2.client.provider.naver.authorization-uri=https://nid.naver.com/oauth2.0/authorize
spring.security.oauth2.client.provider.naver.token-uri=https://nid.naver.com/oauth2.0/token
spring.security.oauth2.client.provider.naver.user-info-uri=https://openapi.naver.com/v1/nid/me
spring.security.oauth2.client.provider.naver.user-name-attribute=response

#google registration
spring.security.oauth2.client.registration.google.client-name=google
spring.security.oauth2.client.registration.google.client-id=
spring.security.oauth2.client.registration.google.client-secret=
spring.security.oauth2.client.registration.google.redirect-uri=http://localhost:8080/login/oauth2/code/google
spring.security.oauth2.client.registration.google.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.google.scope=profile,email
```

- spring.jpa.hibernate.ddl-auto: 개발, 테스트 단계에서는 create로 해도 되지만 이후 운영단계에서는 none으로 설정하는 것이 좋다.
- spring.jwt.secret: JWT를 생성할 때 필요한 키 값으로 되도록 길게 만들고 외부에 노출하지 않아야 한다.
- OAuth2를 사용하면서 필요한 환경설정을 추가했다.
    - registration: 외부 서비스에서 우리 서비스를 특정하기 위해 등록하는 정보이다. (필수로 입력해야 함)
    - provider