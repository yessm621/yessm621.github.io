---
title: "Spring Security"
categories:
  - Spring
tags:
  - Spring Security
  - Java
toc: true
toc_sticky: true
---

# Spring Security 적용하기

Spring Security 5.7 버전부터 기존에 사용하던 스프링 시큐리티 적용 방식과 많이 달라졌다. 이 부분에 대해 정리하기 위해 이 포스트를 작성하게 되었다.

Spring Security와 관련된 포스트는 두번에 거쳐 작성할 예정이다.

이번 포스트는 Spring Security를 적용하는 방법에 대해 작성할 것이고 다음 포스트는 작성 스프링 시큐리티를 테스트 코드에 어떻게 적용할 지에 대해 작성하도록 하겠다.

이제 Spring Security를 적용하는 방법에 대해 알아보자.

## dependency 추가

먼저 스프링 시큐리티를 사용하기 위한 디펜던시를 추가해야한다. 참고로 `spring-boot-starter-thymeleaf`를 추가한 이유는 타임리프에서 시큐리티 관련 내용을 작성할 때 필요한 디펜던시인 `thymeleaf-extras-springsecurity5`을 추가하기 위해서이다.

**build.gradle**

```
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.thymeleaf.extras:thymeleaf-extras-springsecurity5'
    testImplementation 'org.springframework.security:spring-security-test'
}
```

## HttpSecurity 구성

이제 본격적으로 시큐리티를 적용하기 위한 코드를 작성해보자.

기존의 시큐리티 관련 설정은 WebSecurityConfigurerAdapter를 상속받아 작성하였다. 하지만 스프링 시큐리티 5.7부터는 SecurityFilterChain을 빈으로 등록하여 사용하는 것으로 바뀌었다. WebSecurityConfigurerAdapter는 deprecated 되었으므로 사용하지 않는 것이 좋다.

```java
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((authz) -> authz
                .anyRequest().authenticated()
            )
            .httpBasic(withDefaults());
    }
}
```

SecurityFilterChain을 빈으로 등록하여 사용하면 다음과 같다.

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
            .authorizeHttpRequests(auth -> auth
                    .mvcMatchers(
                            HttpMethod.GET,
                            "/",
                            "/articles",
                            "/articles/search-hashtag"
                    ).permitAll()
                    .anyRequest().authenticated()
            )
            .formLogin().and()
            .logout()
            .logoutSuccessUrl("/")
            .and()
            .build();
}
```

## WebSercurity 구성

스프링 시큐리티 5.7 이전엔 정적 리소스(css, js 등)를 무시하기 위해 아래와 같은 코드를 사용했었다.

```java
@Configuration
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    public void configure(WebSecurity web) {
        web.ignoring().antMatchers("/ignore1", "/ignore2");
    }

}
```

이 역시도 기존에 사용하던 WebSecurityConfigurerAdapter이 **deprecated** 되었기 때문에 아래와 같은 새로운 방식으로 적용해야 한다. WebSecurityCustomizer에 경로를 작성하게 되면 스프링 시큐리티 검사에서 아예 제외된다.

```java
@Configuration
public class SecurityConfiguration {

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().antMatchers("/ignore1", "/ignore2");
    }
}
```

위의 코드 처럼 경로를 하나씩 지정해주어도 되지만 스프링에서 제공하는 정적 리소스 경로가 있다. 그 내용을 적용하면 아래와 같다.

```java
@Configuration
public class SecurityConfiguration {

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }
}
```

그런데, WebSecurityCustomizer를 사용하게 되면 애플리케이션 시작할 때 warn이 발생하는데 그 내용은 `HttpSecurity에서 작성하는 방식으로 하는 것을 추천한다`고 한다.

따라서, 위의 코드는 아래와 같이 수정했다.

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                            PathRequest.toStaticResources().atCommonLocations()
                    ).permitAll()
                    .mvcMatchers(
                            HttpMethod.GET,
                            "/",
                            "/articles",
                            "/articles/search-hashtag"
                    ).permitAll()
                    .anyRequest().authenticated()
            )
            .formLogin().and()
            .logout()
            .logoutSuccessUrl("/")
            .and()
            .build();
}
```

- requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()

## 인증 정보

UserDetailsService를 사용하여 인증 정보를 가져온다. 인증 정보는 DB에 있으므로 계정관련 리포지토리 빈을 불러와야 한다. (UserAccountRepository)

```java
@Bean
public UserDetailsService userDetailsService(UserAccountRepository userAccountRepository) {
    return username -> userAccountRepository
            .findById(username)
            .map(UserAccountDto::from)
            .map(BoardPrincipal::from)
            .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다. - username: " + username));
}
```

위의 코드는 UserDetailsService의 loadUserByUsername을 람다식으로 구현한 것이다. UsernameNotFoundException은 loadUserByUsername 스펙에 정의되어 있는 것이다.

### BoardPrincipal 작성

BoardPrincipal은 UserDetails를 구현해야 한다. BoardPrincipal은 로그인이 된 상태라면 계정 정보를 담고 있다. 현재 BoardPrincipal에서는 권한에 대한 부분을 구현하지 않았다. 따라서, RoleType을 USER로 고정해두었다.

```java
import com.test.projectboard.dto.UserAccountDto;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

public record BoardPrincipal(
        String username,
        String password,
        Collection<? extends GrantedAuthority> authorities,
        String email,
        String nickname,
        String memo) implements UserDetails {

    public static BoardPrincipal of(String username, String password, String email, String nickname, String memo) {
        Set<RoleType> roleTypes = Set.of(RoleType.USER);

        return new BoardPrincipal(
                username,
                password,
                roleTypes.stream()
                        .map(RoleType::getName)
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toUnmodifiableSet()),
                email,
                nickname,
                memo
        );
    }

    public static BoardPrincipal from(UserAccountDto dto) {
        return BoardPrincipal.of(
                dto.userId(),
                dto.userPassword(),
                dto.email(),
                dto.nickname(),
                dto.memo()
        );
    }

    public UserAccountDto toDto() {
        return UserAccountDto.of(
                username,
                password,
                email,
                nickname,
                memo
        );
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    // 권한에 대한 부분
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public enum RoleType {
        USER("ROLE_USER");

        @Getter
        private final String name;

        RoleType(String name) {
            this.name = name;
        }
    }
}
```

> **참고** 인증과 권한
<br>
간단히 말하면 인증은 로그인 여부, 권한은 로그인한 사용자가 어떠한 권한(사용자, 관리자 등)을 가지고 있는지에 대한 부분이다. 인증과 권한은 다르다.
> 

## PasswordEncoder 작성

createDelegatingPasswordEncoder()는 패스워드 인코더 설정을 팩토리로부터 위임해서 가져오겠다는 뜻이다.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
}
```

## Spring Security 최종 코드

```java
import com.test.projectboard.dto.UserAccountDto;
import com.test.projectboard.dto.security.BoardPrincipal;
import com.test.projectboard.repository.UserAccountRepository;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                PathRequest.toStaticResources().atCommonLocations()
                        ).permitAll()
                        .mvcMatchers(
                                HttpMethod.GET,
                                "/",
                                "/articles",
                                "/articles/search-hashtag"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin().and()
                .logout()
                .logoutSuccessUrl("/")
                .and()
                .build();
    }

    @Bean
    public UserDetailsService userDetailsService(UserAccountRepository userAccountRepository) {
        return username -> userAccountRepository
                .findById(username)
                .map(UserAccountDto::from)
                .map(BoardPrincipal::from)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다. - username: " + username));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
```

## Spring Security와 AuditorAware

AuditorAware를 사용하여 로그인한 사람의 정보를 가져올 수 있다.

```java
import com.test.projectboard.dto.security.BoardPrincipal;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@EnableJpaAuditing
@Configuration
public class JpaConfig {

    @Bean
    public AuditorAware<String> auditorAware() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext())
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(Authentication::getPrincipal)
                .map(BoardPrincipal.class::cast)
                .map(BoardPrincipal::getUsername);
    }
}
```

## Reference.

[Spring Security without the WebSecurityConfigurerAdapter](https://spring.io/blog/2022/02/21/spring-security-without-the-websecurityconfigureradapter)