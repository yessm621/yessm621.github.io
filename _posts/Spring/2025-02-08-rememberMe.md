---
title: "Spring Security, RememberMe (로그인 유지하기)"
categories:
  - Spring
toc: true
toc_sticky: true
---
## 개요

로그인 후 로그인을 유지하기 위한 기능인 RememberMe에 대해 알아보자.

## 로그인 원리

로그인을 하면 서버에서 발급한 JSESSIONID를 클라이언트가 쿠키(Cookies)에 저장한다. 이때 서버에서 발급한 JSESSIONID는 메모리에 저장해둔다.

클라이언트에서 서버로 요청할 때 JSESSIONID를 같이 요청하면 서버에서는 로그인되어 있다고 생각한다. 만약, 클라이언트에서 JSESSIONID를 지우고 요청하면 다시 로그인을 진행해야 한다.

마찬가지로 서버 전원이 꺼지면 메모리에서 관리하던 세션이 없어지므로 다시 로그인해야 한다.

.

.

즉, 서버와 클라이언트 간에 주고 받는 키가 동기화 되어 있으면 로그인 상태, 동기화가 끊어지면 로그아웃 상태라고 생각하면 된다.

.

.

로그인 상태가 유지되는 시간은 서버 설정에 따라 다르다.

1. 세션을 길게 설정: 로그인이 길게 유지되어 사용자는 편하지만, 보안상 안전하지 않고 서버 메모리에 영향을 줄 수 있다.
2. 세션을 짧게 설정: 보안상 안전하지만 자주 로그인을 해줘야 하므로 사용자가 불편하다.

.

.

로그인에서 세션을 사용하는 이유는 HTTP가 무상태 프로토콜(Stateless)이란 특징이 있기 때문이다. 즉, 서버가 클라이언트의 상태를 보존하지 않기 때문에 쿠키, 세션, 토큰과 같은 방법을 사용한다.

.

.

Spring Security에서는 `RememberMe` 기능을 통해 로그인을 유지할 수 있도록 도와준다.

## RememberMe

RememberMe는 사용자 세션이 만료되고 웹 브라우저가 종료된 후에도 사용자의 정보를 기억하여 로그인을 유지시켜주는 기능이다.

RememberMe는 아래와 같이 구현한다.

```java
package me.devstudy.config;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        http.rememberMe(auth -> auth.key("secret-key");

        return http.build();
    }
}
```

- 아주 간단한 코드이다.
- rememberMe()를 통해 로그인 유지 기능을 사용한다.
- 하지만, 위와 같은 구현 방식은 보안상 안전하지 않다.

## RememberMe 개선

```java
package me.devstudy.config;

import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AccountService accountService;
    private final DataSource dataSource;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        ...

        http.rememberMe(auth -> auth
                .userDetailsService(accountService)
                .tokenRepository(tokenRepository()));

        return http.build();
    }

    @Bean
    public PersistentTokenRepository tokenRepository() {
        JdbcTokenRepositoryImpl jdbcTokenRepository = new JdbcTokenRepositoryImpl();
        jdbcTokenRepository.setDataSource(dataSource);
        return jdbcTokenRepository;
    }
}
```

- rememberMe()
    - UserDetailsService: 사용자 정보를 조회할 때 accountService를 사용한다.
- PersistentTokenRepository
    - 토큰을 저장할 DB 설정
    - JdbcTokenRepositoryImpl는 내부적으로 인증을 위한 DB 테이블을 사용한다.
    - JPA를 사용하면 관련된 엔티티만 작성해주면 된다.
        
        ```java
        package me.devstudy.domain;
        
        import jakarta.persistence.*;
        import lombok.Getter;
        
        import java.time.LocalDateTime;
        
        @Entity
        @Getter
        public class PersistentLogins {
        
            @Id
            @Column(length = 64)
            private String series;
        
            @Column(length = 64)
            private String username;
        
            @Column(length = 64)
            private String token;
        
            @Column(length = 64)
            private LocalDateTime lastUsed;
        }
        ```
        

.

.

**로그인 html에 아래 코드 추가**

```html
<div class="form-group form-check">
    <input type="checkbox" class="form-check-input" id="rememberMe" name="remember-me" checked>
    <label class="form-check-label" for="rememberMe" aria-describedby="rememberMeHelp">로그인 유지</label>
</div>
```

## 테스트

![Image](https://github.com/user-attachments/assets/f17a4cd5-db77-4f60-aa0c-9ac4b852e319)

- 위 사진과 같이 ‘로그인 유지’ 체크박스에 체크 후 로그인을 진행한다.

.

![Image](https://github.com/user-attachments/assets/fdecc4bd-465f-45a7-a977-2c3e63cd41ff)

- 로그인 후 쿠키를 확인하면 JSESSIONID와 remember-me가 있는 것을 확인할 수 있다.

.

![Image](https://github.com/user-attachments/assets/bce39731-0c4f-48d8-ba1c-e64fcdc7aa8e)

- 로그인 유지가 잘되는지 확인하기 위해 JSESSIONID를 삭제하고 새로고침을 한다.

.

![Image](https://github.com/user-attachments/assets/418a6ed9-1876-4f4e-9e12-28ef2ee8ab42)

- JSESSIONID를 삭제해도 remember-me를 통해 재로그인 없이 새로운 JSESSIONID를 발급해준 것을 확인할 수 있다.