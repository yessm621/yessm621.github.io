---
layout: post
title: "JWT, OAuth2.0, Security"
date: 2022-10-18T10:40:00
categories: [Spring]
tags:
  - Spring
  - JWT
  - OAuth
author: "유자"
---

<br>

SpringBoot 환경에서 Spring Security를 이용한 인증/인가를 구현할 것, OAuth2.0 인증을 통해 JWT토큰을 발급해줄 것이다. 이후 서버에 요청할 때 발급한 토큰을 Request Header에 입력하여 요청한다.

작성한 코드 구성은 다음과 같다.

![1](https://user-images.githubusercontent.com/79130276/196314328-57655e05-a28c-4188-93d3-5aa158c6bdfa.png)

## 사전 작업

1. 인증이 정상처리 되었을 경우 접근할 수 있는 페이지를 작성한다.
    
    ```java
    @RestController
    @RequestMapping("/members")
    @RequiredArgsConstructor
    public class MemberController {
    
        @GetMapping
        public String MyPage() {
            return "myPage";
        }
    }
    ```
    

2. OAuth를 사용하기 위해 사전에 발급한 client_id, client_secret, callback uri를 application.yml에 작성한다. client_secret값은 다른 사람에게 공개해서는 안된다.
    
    ```
    spring:
      jwt:
        secretKey: ****
      security:
        oauth2:
          client:
            registration:
              github:
                client-id: ****
                client-secret: ******
                redirect-uri: http://localhost:8080/login/oauth2/code/github
    ```

## OAuth 관련 코드

- OAuth2Attribute
- CustomOAuth2UserService
- OAuth2SuccessHandler

### OAuth2Attribute

OAuth 인증 후 보내주는 데이터가 인증 서버마다 다르기 때문에 이곳에서 별도의 처리를 해준다.

```java
package com.smtd.smtdApi.github.common;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;

@ToString
@Builder(access = AccessLevel.PRIVATE)
@Getter
public class OAuth2Attribute {
    private Map<String, Object> attributes;
    private String attributeKey;
    private String email;
    private String name;

    public static OAuth2Attribute of(String provider, String attributeKey,
                                     Map<String, Object> attributes) {
        switch (provider) {
            case "github":
                return ofGithub(attributeKey, attributes);
            default:
                throw new RuntimeException();
        }
    }

    private static OAuth2Attribute ofGithub(String attributeKey,
                                            Map<String, Object> attributes) {
        return OAuth2Attribute.builder()
                .name((String) attributes.get("name"))
                .email((String) attributes.get("email"))
                .attributes(attributes)
                .attributeKey(attributeKey)
                .build();
    }

    public Map<String, Object> convertToMap() {
        Map<String, Object> map = new HashMap<>();
        map.put("id", attributeKey);
        map.put("key", attributeKey);
        map.put("name", name);
        map.put("email", email);

        return map;
    }
}
```

### CustomOAuth2UserService

OAuth2UserService 인터페이스 구현체이다. OAuth 인증을 완료하고 받은 데이터로 우리의 서비스에 접근할 수 있도록 인증 정보를 생성해준다.

```java
package com.smtd.smtdApi.github.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = oAuth2UserService.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        OAuth2Attribute oAuth2Attribute =
                OAuth2Attribute.of(registrationId, userNameAttributeName, oAuth2User.getAttributes());

        log.info("{}", oAuth2Attribute);

        var memberAttribute = oAuth2Attribute.convertToMap();

        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                memberAttribute, "email");
    }
}
```

### OAuth2SuccessHandler

OAuth 로그인 성공 핸들러에서 토큰을 생성하여 회원가입, 로그인 처리하고 Response Header에 토큰을 추가해서 Client로 보내준다.

```java
package com.smtd.smtdApi.github.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smtd.smtdApi.github.dto.MemberDTO;
import com.smtd.smtdApi.github.dto.MemberRequestMapper;
import com.smtd.smtdApi.github.dto.TokenDTO;
import com.smtd.smtdApi.github.entity.Member;
import com.smtd.smtdApi.github.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRequestMapper memberRequestMapper;
    private final ObjectMapper objectMapper;
    private final MemberRepository memberRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        MemberDTO memberDTO = memberRequestMapper.toDTO(oAuth2User);
        TokenDTO token = null;
        Optional<Member> findMember = memberRepository.findByEmail(memberDTO.getEmail());
        if (findMember.isPresent()) {
            token = TokenDTO.builder()
                    .refreshToken(findMember.get().getRefreshToken())
                    .build();
            log.info("{} 로그인", findMember.get().getEmail());
        } else {
            token = jwtTokenProvider.createToken(memberDTO.getEmail(), "USER");
            log.info("{}", token);
            Member member = Member.builder()
                    .email(memberDTO.getEmail())
                    .name(memberDTO.getName())
                    .refreshToken(token.getRefreshToken())
                    .build();
            memberRepository.save(member);
            log.info("{} 회원가입", memberDTO.getEmail());
        }

        writeTokenResponse(response, token);
    }

    private void writeTokenResponse(HttpServletResponse response, TokenDTO token) throws IOException {
        response.setContentType("text/html;charset=UTF-8");

        response.addHeader("Auth", token.getAccessToken());
        response.addHeader("Refresh", token.getRefreshToken());
        response.setContentType("application/json;charset=UTF-8");

        var writer = response.getWriter();
        writer.println(objectMapper.writeValueAsString(token));
        writer.flush();
    }
}
```

## Token 관련 코드

- TokenDTO
- JwtTokenProvider
- JwtAuthenticationFilter
- TokenController

### TokenDTO

Access Token과 Refresh Token으로 이루어져있다.

```java
package com.smtd.smtdApi.github.dto;

import lombok.*;

@ToString
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class TokenDTO {

    private String accessToken;
    private String refreshToken;
}
```

### JwtTokenProvider

Access Token과 Refresh Token을 발급하고 토큰 값이 유효한지 검증한다.

```java
package com.smtd.smtdApi.github.common;

import com.smtd.smtdApi.github.dto.TokenDTO;
import com.smtd.smtdApi.github.entity.Member;
import com.smtd.smtdApi.github.repository.MemberRepository;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    @Value("${spring.jwt.secretKey}")
    private String secretKey;

    private long tokenValidTime = 1000L * 60 * 60 * 3; // 3시간
    private long refreshTokenValidTime = 1000L * 60 * 60 * 24 * 7; // 7일

    private final MemberRepository memberRepository;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    /**
     * jwt token 발급
     */
    public TokenDTO createToken(String email, String role) {
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("role", role);
        Date now = new Date();

        return new TokenDTO(
                Jwts.builder()
                        .setClaims(claims)
                        .setIssuedAt(now)
                        .setExpiration(new Date(now.getTime() + tokenValidTime))
                        .signWith(SignatureAlgorithm.HS256, secretKey)
                        .compact(),
                Jwts.builder()
                        .setClaims(claims)
                        .setIssuedAt(now)
                        .setExpiration(new Date(now.getTime() + refreshTokenValidTime))
                        .signWith(SignatureAlgorithm.HS256, secretKey)
                        .compact());
    }

    // 토큰이 유효한지 확인
    public Authentication getAuthentication(String token) {
        Optional<Member> findMember = memberRepository.findByEmail(getMemberEmail(token));
        Member member = findMember.get();
        return new UsernamePasswordAuthenticationToken(member, "",
                Arrays.asList(new SimpleGrantedAuthority("ROLE_USER")));
    }

    // 이메일 디코딩
    public String getMemberEmail(String token) {
        try {
            return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
        } catch (ExpiredJwtException e) {
            return e.getClaims().getSubject();
        }
    }

    // 토큰의 만료 여부 확인
    public boolean validateTokenExpiration(String token) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
```

### JwtAuthenticationFilter

발급받은 토큰을 이용해 Security 인증을 처리하는 필터를 만든다.

```java
package com.smtd.smtdApi.github.common;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends GenericFilterBean {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * JWT 토큰 검증
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String token = ((HttpServletRequest) request).getHeader("Auth");

        if (token != null && jwtTokenProvider.validateTokenExpiration(token)) {
            if (StringUtils.hasText(token) && jwtTokenProvider.validateTokenExpiration(token)) {
                Authentication auth = jwtTokenProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                log.debug("유효한 JWT 토큰이 없습니다.");
            }

        }
        chain.doFilter(request, response);
    }
}
```

### TokenController

Access Token이 만료되었을 경우 Refresh Token을 이용해 Access Token을 재발급 받는다.

```java
package com.smtd.smtdApi.github.controller;

import com.smtd.smtdApi.github.dto.TokenDTO;
import com.smtd.smtdApi.github.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RequiredArgsConstructor
@RestController
@RequestMapping("/token")
@Slf4j
public class TokenController {

    private final MemberService memberService;

    @GetMapping("/expired")
    public String auth() {
        throw new RuntimeException();
    }

    @GetMapping("/refresh")
    public String refreshAuth(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = request.getHeader("Refresh");

        TokenDTO newToken = memberService.refresh(refreshToken);

        response.addHeader("Auth", newToken.getAccessToken());
        response.addHeader("Refresh", newToken.getRefreshToken());
        response.setContentType("application/json;charset=UTF-8");

        return "HAPPY NEW TOKEN";
    }
}
```

## Security

- SecurityConfig

### SecurityConfig

OAuth 로그인을 활성화하고 앞서 만든 서비스와 인증이 성공하면 처리할 Handler를 등록한다.

```java
package com.smtd.smtdApi.github.common;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomOAuth2UserService oAuth2UserService;
    private final OAuth2SuccessHandler successHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .httpBasic().disable()
                .csrf().disable()
                .formLogin().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/auth/**", "/login", "/token/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)
                .oauth2Login().loginPage("/token/expired")
                .successHandler(successHandler)
                .userInfoEndpoint().userService(oAuth2UserService);

        http.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder encodePassword() {
        return new BCryptPasswordEncoder();
    }
}
```

## 테스트

1. http://localhost:8080/oauth2/authorization/github로 로그인 시도
    - 처음 로그인하는 유저에겐 서버에서 Access Token과 Refresh Token을 발급해준다.
    
    ![2](https://user-images.githubusercontent.com/79130276/196314330-50578c6e-6d0b-4141-8699-48240533c369.png)
    
    - 기존에 로그인을 한적 있는 유저에겐 기존의 Refresh Token만 보여준다.
    
    ![3](https://user-images.githubusercontent.com/79130276/196314333-1c6f0d8a-2a16-460d-ab0e-f95d1fc68756.png)
    
2. 새로 발급받은 AccessToken과 RefreshToken으로 페이지 접속 (Auth: Access Token, Refresh: Refresh Token)

    ![4](https://user-images.githubusercontent.com/79130276/196314337-617a2f7e-d72c-471b-b1a3-1b1bc1fc690f.png)

3. AccessToken이 만료되면 에러 발생

    ![5](https://user-images.githubusercontent.com/79130276/196314341-6970ff5e-5f86-48eb-8d3c-587e9ec6a8d8.png)

4. RefreshToken을 통해 새로운 AccessToken과 RefreshToken을 재발급 받음. Header 값을 확인하면 토큰값을 확인 할 수 있음

    ![6](https://user-images.githubusercontent.com/79130276/196314343-ad1ad89a-00c0-4842-809f-9d3d6f1bed9f.png)