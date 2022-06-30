---
title:  "JWT(Json Web Token) 인증"
# last_modified_at: 2022-04-20T17:20:00
# last_modified_at: 2022-04-21T16:30:00
last_modified_at: 2022-04-25T15:55:00
categories: 
  - SpringBoot
tags:
  - Java
  - SpringBoot
  - JPA
toc: true
toc_label: "Index"
toc_sticky: true
---

## 1. REST API 인증 기법

- Basic 인증
- Bearer 인증
- JSON 웹 토큰

<br>

### 1.1 Basic 인증

**Basic 인증이란**

- 상태가 없는 웹 애플리케이션(Todo 앱)에서 인증을 구현하는 가장 간단한 방법

<br>

**Basic 인증 절차**

1. 모든 HTTP 요청에 아이디와 비밀번호를 같이 보냄
2. 최초 로그인 후 HTTP 요청 헤더의 `Authorization: ‘Basic <ID>:<Password>’` 처럼 Base64로 인코딩한 문자열을 함께 보냄

<br>

**Basic Auth 예**

```
Authorization : Basic a2FpemVuOjEyMzQ1 (ID:Password)
```

3. HTTP 요청을 수신한 서버는 인코딩된 문자열을 디코딩하여 아이디와 비밀번호가 일치하면 요청받은 일을 수행하고, 아니면 거부함

<br>

**Basic 인증의 단점**

1. 아이디와 비밀번호를 노출한다. 
    - 디코딩을 통해 아이디와 비밀번호를 확인할 수 있다.
    - 따라서 보안을 위해 반드시 HTTPS를 사용해야 한다.
2. 사용자를 로그아웃시킬 수 없다
    - 모든 요청이 일종의 로그인 요청이기 때문
    - 여러 디바이스에서 로그인이 가능한 경우 한꺼번에 로그아웃을 하거나 디바이스 별로 로그아웃을 할 수 있는 기능을 Basic 인증은 제공하기 힘들다
3. 사용자 계정 정보가 있는 저장 장소(인증 서버, 인증 DB)의 경우 과부하가 걸릴 확률이 높다
    - 큰 서비스일 수록 문제 발생
4. 인증 서버가 단일 장애점(시스템의 한 부분이 오류가 나는 경우 전체 시스템을 가동 불가하게 함)

<br>

### 1.2 토큰 기반 인증

**토큰 기반 인증이란?**

- 토큰은 최초 로그인 시 서버가 만들어 줌.
- 서버가 토큰을 만들어 반환하면 클라이언트는 이후 요청에 아이디와 비밀번호 대신 토큰을 넘겨 자신이 인증된 사용자임을 알림
- 토큰 기반 요청은 헤더에 `Authorization: Bearer <TOKEN>` 명시

**Bearer Token 예**

```
Authorization: Bearer eyJhbGciOiJIUzUMyIsInJvbGUiOiJST0xFX1VTRVIiLCJpc3MiOiJkZ
```

<br>

**토큰 기반 인증 장점**

1. Basic Auth 에 비해 보안 측면에서 안전하다
2. 서버가 토큰을 마음대로 생성할 수 있으므로 사용자의 인가 정보, 유효 시간을 정해 관리할 수 있다
3. 디바이스마다 다른 토큰을 생성해 주고 유효 시간을 다르게 정하거나 임의로 로그아웃을 할 수 있다

<br>

**토큰 기반 인증 단점**

Basic 인증에서 마주한 스케일 문제를 해결할 수 없다. 즉,  토큰 이용만으로 스케일 문제를 해결할 수 없다

<br>

### 1.3 JSON 웹 토큰 (JWT)

전자 서명된 토큰 중 하나가 **JSON 웹 토큰 (JWT)**

서버에서 전자 서명된 토큰을 이용하면 인증에 따른 스케일 문제를 해결할 수 있다

JWT 토큰은 `{header}.{payload}.{signature}`

**JWT 예**

```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIzMyIsInJvbGUiOiJST0xFX1VTRVIiLCJpc3MiOiJkZWJyYWlucyIsImlhdCI6MTY0NzQ3NjgzMSwiZXhwIjoxNjQ3NDgwNDMxfQ.IXv1DKfaBNGWzTPEzuinyJV789PnWg8EwZQAI6GVCwYvbb6KQKmevvScHPjIHde8fwVz2J2zGcLAuh2QLqUSmw
```

<br>

JWT 를 디코딩하면 다음과 같다

```json
{ // header
	"typ": "JWT",
	"alg": "HS512"
}.
{ // payload
	"sub": "absdcsdfdfsdfds",
	"iss": "demo app",
	"exp": 1595733647,
	"iat": 1595733657
}.
IXv1DKfaBNGWzTPEzuinyJV789PnWg8EwZQAI6GVCwYvbb6KQKmevvScHPjIHde8fwVz2J2zGcLAuh2QLqUSmw
// signature
```

**Header**

- typ(type): 토큰의 타입을 의미
- alg(algorithm): 토큰의 서명을 발행하는데 사용된 해시 알고리즘의 종류를 의미

**Payload**

- sub(subject): 토큰의 주인을 의미. sub는 ID처럼 유일한 식별자
- iss(issuer): 토큰을 발행한 주체를 의미. 페이스북이 발행했다면 facebook 이 됨
- iat(issued at): 토큰일 발행된 날짜와 시간
- exp(expiration): 토큰이 만료되는 시간

**Signature**

- 토큰을 발행한 주체 Issuer가 발행한 서명으로 토큰의 유효성 검사에 사용

<br>

JWT에서 전자 서명이란 {헤더}.{페이로드}와 시크릿키를 이용해 해시 함수에 돌린 암호화한 결과 값

**시크릿키**란 나만 알고있는 문자열, 비밀번호 같은 것

<br>

**JWT 인증 절차**

1. 최초 로그인 시 서버는 사용자의 아이디와 비밀번호를 서버에 저장된 값과 비교해 인증
2. 인증된 사용자의 경우 사용자의 정보를 이용해 {헤더}.{페이로드} 부분을 작성, 시크릿키로 {헤더}.{페이로드} 부분을 전자 서명
3. 전자 서명의 결과로 나온 값을 {헤더}.{페이로드}.{서명}으로 이어붙이고 Base64로 인코딩 후 반환
4. 이후 이 토큰으로 리소스 접근 요청하면 서브는 토큰을 디코딩해 {헤더}.{페이로드}와 {서명} 부분으로 나눔
5. 서버는 {헤더}.{페이로드}와 시크릿키로 전자 서명을 만든 후 방금 만든 전자 서명을 HTTP 요청이 갖고 온 {서명} 부분과 비교해 이 토큰의 유효성을 검사

<br>

위 과정을 통해 JWT 인증 방식은 인증 서버에 토큰의 유효성에 대해 물어볼 필요가 없다. 따라서 인증 서버에 부하를 일으키지 않는다. 즉, 인증 서버가 단일 장애점이 아니다.

<br>

토큰을 훔쳐가면 해당 계정의 리소스에 접근 할 수 있기 때문에 이를 방지하기 위해 HTTPS를 통해 통신해야 함.

<br>

## 2. 스프링 시큐리티 통합

- JWT 인증 로직 구현
- 패스워드 암호화 로직 구현

<br>

### 2.1 실습 전 준비

- User.java
- UserRepository.java
- UserService.java
- UserDTO.java
- UserController.java

<br>

**User.java**

```java
package me.yessm.userauth.user;

import lombok.*;

import javax.persistence.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = "email")})
public class User {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
}
```

<br>

**UserRepository.java**

```java
package me.yessm.userauth.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    Boolean existsByEmail(String email);
    User findByEmailAndPassword(String email, String password);
}
```

<br>

**UserService.java**

```java
package me.yessm.userauth.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User create(final User user) {
        if (user == null || user.getEmail() == null) {
            throw new RuntimeException("Invalid arguments");
        }

        final String email = user.getEmail();
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        return userRepository.save(user);
    }

    public User getByCredentials(final String email, final String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }
}
```

<br>

**UserDTO.java**

```java
package me.yessm.userauth.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private String token;
    private String email;
    private String username;
    private String password;
    private Long id;
}
```

<br>

**UserController.java**

```java
package me.yessm.userauth.user;

import me.yessm.userauth.common.ResponseDTO;
import me.yessm.userauth.security.TokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            User user = User.builder()
                    .email(userDTO.getEmail())
                    .username(userDTO.getUsername())
                    .password(userDTO.getPassword())
                    .build();

            User registeredUser = userService.create(user);
            UserDTO responseUserDTO = UserDTO.builder()
                    .email(registeredUser.getEmail())
                    .id(registeredUser.getId())
                    .username(registeredUser.getUsername())
                    .build();

            return ResponseEntity.ok().body(responseUserDTO);
        } catch (Exception e) {
            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();

            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody UserDTO userDTO) {
        User user = userService.getByCredentials(
                userDTO.getEmail(),
                userDTO.getPassword());

        if (user != null) {
            final UserDTO responseUserDTO = UserDTO.builder()
                    .email(user.getUsername())
                    .id(user.getId())
                    .build();

            return ResponseEntity.ok().body(responseUserDTO);
        } else {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .error("Login failed")
                    .build();

            return ResponseEntity.badRequest().body(responseDTO);
        }
    }
}
```

<br>

### 2.2 JWT 생성 및 반환 구현

사용자 정보를 바탕으로 헤더와 페이로드를 작성학고 전자 서명한 후 토큰을 리턴

![1st](https://user-images.githubusercontent.com/79130276/165035377-bf150b8d-9076-4ad8-aa7c-58d68dbe282b.png)

<br>

**1. JWT 관련 라이브러리 추가**

```
implementation group: 'io.jsonwebtoken', name: 'jjwt', version: '0.9.1'
```

<br>

**2. TokenProvider 생성**

**TokenProvider.java**

```java
package me.yessm.userauth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import me.yessm.userauth.user.User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class TokenProvider {

    private static final String SECRET_KEY = "test12341234";

    public String create(User user) {
        Date expiryDate = Date.from(Instant.now().plus(1, ChronoUnit.DAYS));

        return Jwts.builder()
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .setSubject(user.getEmail())
                .setIssuer("yessm app")
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .compact();
    }

    public String validateAndGetUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }
}
```

TokenProvider 클래스가 하는 일은 사용자 정보를 받아 JWT를 생성하는 일

create(): JWT 라이브러리를 이용해 `JWT 토큰을 생성`

validateAndGetUserId(): 토큰을 **디코딩** 및 파싱하고 토큰의 위조 여부 확인

<br>

**3. UserController.java 수정**

```java
    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody UserDTO userDTO) {
        User user = userService.getByCredentials(
                userDTO.getEmail(),
                userDTO.getPassword());

        if (user != null) {
            // 토큰 생성, UserDTO에 추가
            final String token = tokenProvider.create(user);
            final UserDTO responseUserDTO = UserDTO.builder()
                    .email(user.getUsername())
                    .id(user.getId())
                    .token(token)
                    .build();

            return ResponseEntity.ok().body(responseUserDTO);
        } else {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .error("Login failed")
                    .build();

            return ResponseEntity.badRequest().body(responseDTO);
        }
    }
```

<br>

**4. 테스트**

![Untitled1](https://user-images.githubusercontent.com/79130276/165035696-197d4e9f-3571-4796-aa79-6672d902d0b2.png)

![Untitled2](https://user-images.githubusercontent.com/79130276/165035700-793c4d71-4713-472d-a86b-2fc5a8976d29.png)

**인코딩된 JWT 토큰**

```json
{
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5ZXNzbTYyM0BnbWFpbC5jb20iLCJpc3MiOiJ5ZXNzbSBhcHAiLCJpYXQiOjE2NTAzNDU3NjEsImV4cCI6MTY1MDQzMjE2MX0.znuDrNcPA6BcKUzbysOQJ99vxm_OCTPpEhr1DUfveMjkkDh1uEKn4zF7pHSBiz3cTR4gBRalyKMDUHgn3RSIHA",
    "email": "user1",
    "username": null,
    "password": null,
    "id": 3
}
```

<br>

### 2.3 스프링 시큐리티와 서블릿 필터

![2nd](https://user-images.githubusercontent.com/79130276/165035383-af82a211-0dca-45a5-921a-8c2819fa434b.png)

<br>

**스프링 시큐리티**의 도움을 받아 API가 실행될 때마다 **사용자를 인증해 주는 부분을 구현**

토큰 인증을 위해 컨트롤러 메서드의 첫 부분마다 인증 코드를 작성하기 위해 `서블릿 필터`를 사용

<br>

스프링 시큐리티는 **서블릿 필터의 집합.**  서블릿 필터란 서블릿 실행 전에 실행되는 클래스들

스프링이 구현하는 서블릿이 디스패처 서블릿이고 서블릿 필터는 디스패처 서블릿이 실행되기 전에 항상 실행됨

따라서, 개발자는 **서블릿 필터를 구현**하고 **서블릿 필터를 서블릿 컨테이너가 실행하도록 설정**해 주기만 하면 된다

<br>

`서블릿 필터`는 구현된 로직에 따라 원하지 않는 HTTP 요청을 걸러낼 수 있다.

걸러낸 HTTP는 거절되는 것이고 서블릿 필터가 전부 살아남은 HTTP요청은 디스패처 서블릿으로 넘어와 컨트롤러에서 실행됨

<br>

### 2.4 JWT를 이용한 인증 구현

**스프링 시큐리티관련 라이브러리 추가**

```
implementation 'org.springframework.boot:spring-boot-starter-security'
```

<br>

**OncePerRequestFilter 클래스**를 상속해 필터를 생성

OncePerRequestFilter는 한 요청당 반드시 한 번만 실행됨

<br>

OncePerRequestFilter를 상속받는 JwtAuthenticationFilter를 구현

**JwtAuthenticationFilter.java**

```java
package me.yessm.userauth.security;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Log4j2
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private TokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // 요청에서 토큰 가져옴
            String token = parseBearerToken(request);

            if (token != null && !token.equalsIgnoreCase("null")) {
                // userId 가져오기, 위조된 경우 예외 처리
                String userId = tokenProvider.validateAndGetUserId(token);

                // 인증 완료. SecurityContextHolder에 등록해야 인증된 사용자라고 생각한다
                AbstractAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userId, null, AuthorityUtils.NO_AUTHORITIES);

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
                securityContext.setAuthentication(authentication);
                SecurityContextHolder.setContext(securityContext);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }
        filterChain.doFilter(request, response);
    }

    private String parseBearerToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

<br>

위 코드의 처리 과정

1. 요청의 헤더에서 **Bearer 토큰**을 가져옴
2. TokenProvider를 이용해 토큰을 인증하고 **UsernamePasswordAuthenticationToken 작성**
    
    → UsernamePasswordAuthenticationToken 오브젝트에 사용자의 인증 정보를 저장하고 SecurityContext에 인증된 사용자를 등록
    
    → 등록하는 이유? 요청을 처리하는 과정에서 사용자가 인증됐는지의 여부나 인증된 사용자가 누군지 알아야 할 때가 있기 때문
    
<br>

스프링 시큐리티의 SercurityContext는 SecurityContextHolder의 createEmptyContext() 메서드를 이용해 생성 가능

생성한 컨텍스트에 인증 정보인 authentication을 넣고 다시 SecurityContextHolder에 컨텍스트로 등록

SecurityContextHolder는 기본적으로 ThreadLocal에 저장됨

ThreadLocal에 저장되므로 Thread마다 하나의 컨텍스트를 관리할 수 있음

<br>

### 2.5 스프링 시큐리티 설정

`서블릿 필터를 사용`하려면

1. 서블릿 필터를 구현해야 함
2. 서블릿 컨테이너에 이 서블릿 필터를 사용하라고 알려주는 설정 작업

<br>

스프링 시큐리티에 JwtAuthenticationFilter를 사용하라고 알려주자

<br>

**WebSecurityConfig.java**

```java
package me.yessm.userauth.config;

import me.yessm.userauth.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.filter.CorsFilter;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors()
                .and()
                .csrf()
                .disable()
                .httpBasic()
                .disable()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/", "/auth/**").permitAll()
                .anyRequest()
                .authenticated();

        http.addFilterAfter(
                jwtAuthenticationFilter,
                CorsFilter.class
        );
    }
}
```

`HttpSecurity` 는 시큐리티 설정을 위한 오브젝트

web.xml 대신 `HttpSecurity` 를 이용해 시큐리티 관련 설정을 하는 것

<br>

addFilterAfter() 메서드를 통해 CorsFilter 이후에  jwtAuthenticationFilter 실행하게 설정

<br>

**테스팅**
1. 회원가입 후 다시 로그인을 하면 아래 그림과 같이 응답과 함께 토큰이 온다

![Untitled3](https://user-images.githubusercontent.com/79130276/165035702-f6a1c8bd-73bd-4d77-81d6-bf0007dc4601.png)

<br>

2. Authorization 에 Bearer Token 을 선택하고 토큰을 복사하여 붙여넣기 한다

![Untitled4](https://user-images.githubusercontent.com/79130276/165035709-7407c498-ec58-49db-8815-56bd03471330.png)

<br>

3. 토큰이 위조되면 아래와 같은 에러메시지가 발생한다.

```
// JWT를 신뢰할 수 없어 예외 처리됨
io.jsonwebtoken.SignatureException: 
JWT signature does not match locally computed signature. 
JWT validity cannot be asserted and should not be trusted.
```

<br>

### 2.6 TodoController에서 인증된 사용자 사용하기

**TodoController.java**

```java
package me.yessm.userauth.controller;

import me.yessm.userauth.dto.ResponseDTO;
import me.yessm.userauth.dto.TodoDTO;
import me.yessm.userauth.entity.Todo;
import me.yessm.userauth.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("todo")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @GetMapping("/test")
    public ResponseEntity<?> testTodo() {
        String str = todoService.testService();
        List<String> list = new ArrayList<>();
        list.add(str);
        ResponseDTO<String> response = ResponseDTO.<String>builder().data(list).build();

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createTodo(
            @AuthenticationPrincipal String userId,
            @RequestBody TodoDTO dto) {
        try {
            Todo entity = TodoDTO.toEntity(dto);
            entity.setId(null);
            entity.setUserId(userId);

            List<Todo> entities = todoService.create(entity);
            List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());

            ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().data(dtos).build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String error = e.getMessage();
            ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().error(error).build();

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<?> retrieveTodoList(
            @AuthenticationPrincipal String userId) {
        System.out.println("UserID : " + userId);
        List<Todo> entities = todoService.retrieve(userId);

        List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());

        ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().data(dtos).build();

        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<?> updateTodo(@AuthenticationPrincipal String userId,
                                        @RequestBody TodoDTO dto) {
        Todo entity = TodoDTO.toEntity(dto);
        entity.setUserId(userId);
        List<Todo> entities = todoService.update(entity);

        List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());

        ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().data(dtos).build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteTodo(
            @AuthenticationPrincipal String userId,
            @RequestBody TodoDTO dto) {
        try {
            Todo entity = TodoDTO.toEntity(dto);
            entity.setUserId(userId);
            List<Todo> entities = todoService.delete(entity);

            List<TodoDTO> dtos = entities.stream().map(TodoDTO::new).collect(Collectors.toList());

            ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().data(dtos).build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String error = e.getMessage();
            ResponseDTO<TodoDTO> response = ResponseDTO.<TodoDTO>builder().error(error).build();

            return ResponseEntity.badRequest().body(response);
        }
    }
}
```

<br>

매개변수 userId 는 스프링의 @AuthenticationPrincipal 를 이용해서 찾는다

<br>

@AuthenticationPrincipal 이란?

```java
AbstractAuthenticationToken authentication = 
new UsernamePasswordAuthenticationToken(userId, null, AuthorityUtils.NO_AUTHORITIES);
```

UsernamePasswordAuthenticationToken 생성자의 첫 매개변수가 AuthenticationPrincipal 이다

<br>

### 2.7 패스워드 암호화

스프링 시큐리티가 제공하는 BCryptPasswordEncoder 를 사용

<br>

**UserService.java**

```java
...

	public User getByCredentials(final String email, final String password, final PasswordEncoder encoder) {
        final User originalUser = userRepository.findByEmail(email);

        if (originalUser != null && encoder.matches(password, originalUser.getPassword())) {
            return originalUser
        }
        return userRepository.findByEmailAndPassword(email, password);
    }

...
```

BCryptPasswordEncoder 는 같은 값을 인코딩해도 할 때마다 값이 다르기 때문에 `matches()` 메서드를 이용해 패스워드가 같은지 비교

<br>

**UserController.java 수정**

```java
package me.yessm.userauth.controller;

import me.yessm.userauth.dto.ResponseDTO;
import me.yessm.userauth.dto.UserDTO;
import me.yessm.userauth.entity.User;
import me.yessm.userauth.security.TokenProvider;
import me.yessm.userauth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TokenProvider tokenProvider;

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            User user = User.builder()
                    .email(userDTO.getEmail())
                    .username(userDTO.getUsername())
                    .password(passwordEncoder.encode(userDTO.getPassword()))
                    .build();

            User registeredUser = userService.create(user);
            UserDTO responseUserDTO = UserDTO.builder()
                    .email(registeredUser.getEmail())
                    .id(registeredUser.getId())
                    .username(registeredUser.getUsername())
                    .build();

            return ResponseEntity.ok().body(responseUserDTO);
        } catch (Exception e) {
            ResponseDTO responseDTO = ResponseDTO.builder().error(e.getMessage()).build();

            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticate(@RequestBody UserDTO userDTO) {
        System.out.println("signin userDTO: " + userDTO);
        User user = userService.getByCredentials(
                userDTO.getEmail(),
                userDTO.getPassword(),
                passwordEncoder);

        if (user != null) {
            // 토큰 생성
            final String token = tokenProvider.create(user);
            final UserDTO responseUserDTO = UserDTO.builder()
                    .email(user.getUsername())
                    .id(user.getId())
                    .token(token)
                    .build();

            return ResponseEntity.ok().body(responseUserDTO);
        } else {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .error("Login failed")
                    .build();

            return ResponseEntity.badRequest().body(responseDTO);
        }
    }
}
```